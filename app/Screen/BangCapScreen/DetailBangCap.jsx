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

export default function DetailBangCap({ navigation, route }) {
  const { maBC, tenBC } = route.params.item;

  const [visibleModal, setVisibleModal] = useState(false);

  // Thêm nhiều nhân viên khác vào đây

  return (
    <>
      <View style={styles.header}>
        {/* Sử dụng BackNav với onEditPress */}
        <BackNav
          navigation={navigation}
          name={"Chi tiết bằng cấp"}
          btn={"Chỉnh sửa"}
          onEditPress={() => {
            setVisibleModal(true);
          }}
        />
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Image
            source={require("../../../assets/image/images.png")}
            style={styles.image}
          />

          {/* Thông tin nhân viên */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Mã bằng cấp</Text>
            <Text style={styles.sectionTitle1}>{maBC}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Tên bằng cấp</Text>
            <Text style={styles.sectionTitle1}>{tenBC}</Text>
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
                  placeholder="Tên bằng cấp"
                  value={tenBC}
                />
              </View>

              <View style={styles.bodyBtn}>
                <TouchableOpacity style={styles.btnThem}>
                  <Text style={styles.nameBtn}>Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnXoa}>
                  <Text style={styles.nameBtn}>Xóa</Text>
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
  image: {
    width: "70%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    margin: 20,
    marginLeft: 60,
  },
  infoSection: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  sectionTitle1: {
    fontSize: 20,
    marginBottom: 20,
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
