import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import HeaderNav from "../../Compoment/HeaderNav";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function QuanLyMucLuong({ navigation }) {
  const data = 4750000;

  const [visibleModal, setVisibleModal] = useState(false);

  // Thêm nhiều nhân viên khác vào đây

  return (
    <>
      <View style={styles.header}>
        {/* Sử dụng BackNav với onEditPress */}
        <BackNav navigation={navigation} name={"Quản lý mức lương"} />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.infoSection}>
            <Text>Mức lương cơ bản </Text>
            <Text></Text>
            <View style={styles.viewText}>
              <Text style={styles.sectionTitle}>
                {(data + "").replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " vnđ"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisibleModal(true);
                }}
              >
                <Icon name="edit" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Modal visible={visibleModal} transparent={true} animationType="slide">
          <View style={styles.modalCtn}>
            <View style={styles.bodyModal}>
              <View style={{ width: "95%", alignSelf: "center" }}>
                <HeaderNav
                  name={"Chỉnh sửa"}
                  nameIconRight={"close"}
                  onEditPress={() => {
                    setVisibleModal(false);
                  }}
                />
              </View>

              <View style={styles.body}>
                <Text></Text>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Lương cơ bản"
                  keyboardType="numeric"                />
              </View>

              <View style={styles.bodyBtn}>
                <TouchableOpacity style={styles.btnThem}>
                  <Text style={styles.nameBtn}>Cập nhật</Text>
                </TouchableOpacity>
              
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    margin: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  infoSection: {
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  viewText: {
    borderWidth: 1,
    alignItems: "center",
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
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

  btnXoa: {
    width: "90%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  nameBtn: { fontSize: 22, color: "#FFFFFF" },
});
