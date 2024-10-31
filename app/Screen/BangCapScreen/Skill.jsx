import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,
  Alert,
} from "react-native";
import ItemListEmployee from "../../Compoment/ItemEmployee";
import BackNav from "../../Compoment/BackNav";
import HeaderNav from "../../Compoment/HeaderNav";
import { readSkills, addSkill } from "../../services/skill";
import { useFocusEffect } from "@react-navigation/native";

export default function DanhSachSkill({ navigation }) {
  const [data, setData] = useState([]); // Lưu danh sách kỹ năng
  const [visibleModal, setVisibleModal] = useState(false);
  const [maSKill, setMaSkill] = useState(""); // Mã kỹ năng
  const [tenSkill, setTenSkill] = useState(""); // Tên kỹ năng

  // Đọc dữ liệu kỹ năng khi màn hình được load

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const skillsData = await readSkills();
        setData(skillsData); // Cập nhật dữ liệu từ Firebase
      };
      fetchData();
    }, [])
  );

  const handlePress = (mask) => {
    navigation.navigate("SkillDetail", { item: { maSK: mask } });
    console.log(mask);
  };

  // Thêm kỹ năng và cập nhật danh sách
  const handleAddSkill = async () => {
    if (!maSKill || !tenSkill) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ thông tin.");
      return;
    }

    const newSkill = { mask: maSKill, tensk: tenSkill };

    // Kiểm tra nếu mã kỹ năng đã tồn tại
    const skillExists = data.some((skill) => skill.mask === maSKill);
    if (skillExists) {
      Alert.alert("Lỗi", "Mã kỹ năng này đã tồn tại.");
      return;
    }

    try {
      await addSkill(newSkill); // Ghi dữ liệu vào Firebase

      // Cập nhật danh sách kỹ năng sau khi thêm
      setData((prevData) => [...prevData, newSkill]);

      // Reset form và đóng modal
      setMaSkill("");
      setTenSkill("");
      setVisibleModal(false);
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi thêm kỹ năng."); // Thông báo lỗi chung
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <BackNav
          navigation={navigation}
          name={"Danh sách Skill"}
          btn={"Thêm"}
          soLuong={data.length}
          onEditPress={() => setVisibleModal(true)}
        />
      </View>

      <FlatList
        style={{ marginTop: 20 }}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item.mask)}>
            <ItemListEmployee manv={item.mask} name={item.tensk} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.mask}
      />

      <Modal visible={visibleModal} transparent={true} animationType="slide">
        <View style={styles.modalCtn}>
          <View style={styles.bodyModal}>
            <View style={{ width: "95%", alignSelf: "center" }}>
              <HeaderNav
                name={"Thêm Skill"}
                nameIconRight={"close"}
                onEditPress={() => setVisibleModal(false)}
              />
            </View>

            <View style={styles.body}>
              <TextInput
                style={styles.TextInput}
                placeholder="Mã skill"
                value={maSKill}
                onChangeText={setMaSkill}
              />
              <TextInput
                style={styles.TextInput}
                placeholder="Tên skill"
                value={tenSkill}
                onChangeText={setTenSkill}
              />
            </View>

            <View style={styles.bodyBtn}>
              <TouchableOpacity style={styles.btnThem} onPress={handleAddSkill}>
                <Text style={styles.nameBtn}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  modalCtn: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyModal: {
    width: "85%",
    height: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  body: {
    flex: 1,
    marginTop: 30,
    alignItems: "center",
    width: "100%",
  },
  TextInput: {
    width: "90%",
    height: 50,
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    fontSize: 20,
  },
  bodyBtn: {
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
  },
  btnThem: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
  },
  nameBtn: {
    fontSize: 22,
    color: "#FFFFFF",
  },
});
