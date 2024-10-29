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
import { readBangCap, writeBangCap } from "../../services/database";
import { useFocusEffect } from "@react-navigation/native";
import { validateBangCapData } from "../../utils/validate";

export default function DanhSachBangCap({ navigation }) {
  const [data, setData] = useState([]); // Lưu danh sách bằng cấp
  const [visibleModal, setVisibleModal] = useState(false);
  const [maBC, setMaBC] = useState(""); // Mã bằng cấp
  const [tenBC, setTenBC] = useState(""); // Tên bằng cấp

  // Đọc dữ liệu bằng cấp khi màn hình được load
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const bangCapData = await readBangCap();
        setData(Object.values(bangCapData || {})); // Cập nhật dữ liệu nếu có
      };
  
      fetchData();
    }, [])
  );

  const handlePress = (item) => {
    navigation.navigate("DetailBangCap", { item });
  };

  // Thêm bằng cấp và cập nhật danh sách
  const handleAddBangCap = async () => {
    const newBangCap = { bangcap_id: maBC, tenBang: tenBC };
    const validationErrors = validateBangCapData(newBangCap);

    if (validationErrors.length > 0) {
      Alert.alert("Lỗi", validationErrors.join("\n"));
      return;
    }

    await writeBangCap(newBangCap); // Ghi dữ liệu vào Firebase

    // Cập nhật danh sách bằng cấp sau khi thêm
    setData((prevData) => [...prevData, newBangCap]);

    // Reset form và đóng modal
    setMaBC("");
    setTenBC("");
    setVisibleModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <BackNav
          navigation={navigation}
          name={"Danh sách bằng cấp"}
          btn={"Thêm"}
          soLuong={data.length}
          onEditPress={() => setVisibleModal(true)}
        />
      </View>

      <FlatList
        style={{ marginTop: 20 }}
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <ItemListEmployee manv={item.bangcap_id} name={item.tenBang} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal visible={visibleModal} transparent={true} animationType="slide">
        <View style={styles.modalCtn}>
          <View style={styles.bodyModal}>
            <View style={{ width: "95%", alignSelf: "center" }}>
              <HeaderNav
                name={"Thêm bằng cấp"}
                nameIconRight={"close"}
                onEditPress={() => setVisibleModal(false)}
              />
            </View>

            <View style={styles.body}>
              <TextInput
                style={styles.TextInput}
                placeholder="Mã bằng cấp"
                value={maBC}
                onChangeText={setMaBC}
              />
              <TextInput
                style={styles.TextInput}
                placeholder="Tên bằng cấp"
                value={tenBC}
                onChangeText={setTenBC}
              />
            </View>

            <View style={styles.bodyBtn}>
              <TouchableOpacity style={styles.btnThem} onPress={handleAddBangCap}>
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
