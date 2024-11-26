import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import {
  traThietBi,
  updateThietBiNhanVien,
} from "../../services/thietBicongty";

export default function ChiTietCapThietBiNV({ navigation, route }) {
  const { thietBi } = route.params;

  const [soLuong, setSoLuong] = useState(""); // Số lượng nhập vào
  const [isModalVisible, setModalVisible] = useState(false); // Trạng thái Modal

  const handleTraThietBi = async () => {
    // Kiểm tra tính hợp lệ của số lượng
    if (isNaN(soLuong) || soLuong <= 0) {
      Alert.alert("Lỗi", "Số lượng không hợp lệ!");
      return;
    }
    if (soLuong > thietBi.soLuongMay) {
      Alert.alert("Lỗi", "Số lượng trả không được lớn hơn số lượng hiện có!");
      return;
    }

    try {
      // Cập nhật số lượng thiết bị
      await traThietBi(thietBi.id, {
        daCap: thietBi.daCap - soLuong,
      });

      // Cập nhật số lượng thiết bị của nhân viên
      await updateThietBiNhanVien(thietBi.employeeId, thietBi.id, {
        soLuong: thietBi.soLuongMay - soLuong,
      });

      // Đóng Modal và quay lại
      setModalVisible(false);
      navigation.goBack();

      Alert.alert("Thông báo", "Trả thiết bị thành công");
    } catch (error) {
      Alert.alert("Lỗi", "Hiện tại không thể trả");
    }
  };

  const traThietBiNV = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 100 }}>
        <BackNav navigation={navigation} name={"Chi tiết thiết bị"} />
      </View>

      <ScrollView style={{ paddingHorizontal: 15 }}>
        <View style={styles.card}>
          <Text style={styles.label}>Ảnh thiết bị:</Text>
          <View style={styles.avatarContainer}>
            <Image
              source={
                thietBi?.imageUrl
                  ? { uri: thietBi?.imageUrl }
                  : require("../../../assets/image/images.png")
              }
              style={styles.avatar}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Tên thiết bị:</Text>
            <Text style={styles.textDetail}> {thietBi?.ten}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Loại:</Text>
            <Text style={styles.textDetail}> {thietBi?.loai}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Hãng:</Text>
            <Text style={styles.textDetail}>{thietBi?.hang}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.label}>Số lượng</Text>
            <Text style={styles.textDetail}>{thietBi?.soLuongMay}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Ngày cấp:</Text>
            <Text style={styles.textDetail}>{thietBi?.ngayCap}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={traThietBiNV}>
          <Text style={styles.buttonText}>Trả thiết bị</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal nhập số lượng */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập số lượng thiết bị</Text>
            <TextInput
              style={styles.input}
              value={soLuong}
              onChangeText={(text) => setSoLuong(text.replace(/[^0-9]/g, ""))}
              keyboardType="numeric"
              placeholder="Nhập số lượng"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "gray" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleTraThietBi}
              >
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    justifyContent: "space-between",
  },
  avatar: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  cardRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    width: "45%",
  },
  textDetail: {
    fontSize: 18,
    width: "53%",
    color: "#555",
    textAlign: "right",
  },
  button: {
    backgroundColor: "red",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
