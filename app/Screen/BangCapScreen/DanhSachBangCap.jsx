import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,
} from "react-native";
import ItemListEmployee from "../../Compoment/ItemEmployee";
import BackNav from "../../Compoment/BackNav";
import HeaderNav from "../../Compoment/HeaderNav";

const data = [
  { maBC: "BC001", tenBC: "Tiếng Anh AI EO" },
  { maBC: "BC002", tenBC: "Chứng Chỉ Tin Học" },
  { maBC: "BC003", tenBC: "Chứng chỉ quân sự" },

  // Thêm nhiều nhân viên khác vào đây
];
const itemCount = data.length;

export default function DanhSachBangCap({ navigation }) {
  const [visibleModal, setVisibleModal] = useState(false);

  const handlePress = (item) => {
    navigation.navigate("DetailBangCap", { item });
  };
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <BackNav
          navigation={navigation}
          name={"Danh sách bằng cấp"}
          btn={"Thêm"}
          onEditPress={() => {
            setVisibleModal(true);
          }}
        />
        {/* <Text style={styles.headerText}>{"120"}</Text> */}
      </View>

      {/* Employee List */}
      <FlatList
        style={{ marginTop: 20 }} // Adjust margin as needed
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <ItemListEmployee manv={item.maBC} name={item.tenBC} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()} // Use index as a key
      />

      <Modal visible={visibleModal} transparent={true} animationType="slide">
        <View style={styles.modalCtn}>
          <View style={styles.bodyModal}>
            <View style={{ width: "95%", alignSelf: "center" }}>
              <HeaderNav
                name={"Thêm bằng cấp"}
                nameIconRight={"close"}
                onEditPress={() => {
                  setVisibleModal(false);
                }}
              />
            </View>

            <View style={styles.body}>
              <TextInput style={styles.TextInput} placeholder="Mã bằng cấp" />
              <Text></Text>
              <TextInput style={styles.TextInput} placeholder="Tên bằng cấp" />
            </View>

            <View style={styles.bodyBtn}>
                  <TouchableOpacity style={styles.btnThem}>
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
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Add space between BackNav and number text
    paddingHorizontal: 15,
  },
  headerText: {
    fontSize: 24, // Font size for "120"
    fontWeight: "bold",
    color: "#000000", // Black color
    marginRight: 100, // Optional: Add margin to space from BackNav
  },

  // modal styles
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
    borderRadius: 20,
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
  },
  nameBtn: { fontSize: 22, color: "#FFFFFF" },
});
