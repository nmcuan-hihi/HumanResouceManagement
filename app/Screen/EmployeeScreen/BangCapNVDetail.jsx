import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import BackNav from "../../Compoment/BackNav";
import { readBangCapNhanVien1, toggleXacthuc } from "../../services/bangcapdb"; // Hàm lấy chi tiết bằng cấp và toggle xacthuc
import { Calendar } from "react-native-calendars";

export default function DetailBangCapNhanVien({ navigation, route }) {
  const { bangcap_id, employeeId } = route.params;
  const [bangCapDetail, setBangCapDetail] = useState(null);
  const [visibleCalendar, setVisibleCalendar] = useState(false);

  useEffect(() => {
    // Hàm lấy chi tiết bằng cấp
    const fetchBangCapDetail = async () => {
      const data = await readBangCapNhanVien1(bangcap_id, employeeId);
      setBangCapDetail(data);
    };
    fetchBangCapDetail();
  }, [bangcap_id, employeeId]);

  const handleXacThuc = async () => {
    if (!bangCapDetail || !bangCapDetail.bangcap_id) {
      console.log("Item không hợp lệ:", bangCapDetail);
      return;
    }

    const message =
      bangCapDetail.xacthuc === "0"
        ? "Xác thực bằng cấp này là chuẩn? Bạn có muốn xác thực bằng cấp này không?"
        : "Bạn muốn hủy xác thực bằng cấp này?";

    Alert.alert(
      "Xác thực bằng cấp",
      message,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            // Gọi hàm toggleXacthuc để cập nhật giá trị xacthuc
            const updatedXacthuc = await toggleXacthuc(employeeId, bangCapDetail.bangcap_id);

            // Cập nhật lại dữ liệu ngay lập tức sau khi thay đổi xacthuc
            if (updatedXacthuc !== null) {
              const data = await readBangCapNhanVien1(bangcap_id, employeeId);
              setBangCapDetail(data);

              // Hiển thị thông báo thành công
              const newXacthucStatus = bangCapDetail.xacthuc === "0" ? "1" : "0";
              Alert.alert(
                "Thông báo",
                newXacthucStatus === "1" ? "Xác thực thành công!" : "Hủy xác thực thành công!",
                [{ text: "OK" }]
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!bangCapDetail) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <BackNav navigation={navigation} name={"Chi tiết Bằng cấp"} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <View style={styles.card}>
            <Text style={styles.label}>
              Bằng cấp:{" "}
              <Text style={styles.textDetail}>{bangCapDetail.bangcap_id || "N/A"}</Text>
            </Text>
            <Text style={styles.label}>
              Ngày cấp:{" "}
              <Text style={styles.textDetail}>{bangCapDetail.ngaycap || "N/A"}</Text>
            </Text>
            <Text style={styles.label}>
              Mô tả:{" "}
              <Text style={styles.textDetail}>{bangCapDetail.mota || "Không có mô tả"}</Text>
            </Text>
          </View>

          <Modal animationType="slide" transparent={true} visible={visibleCalendar}>
            <View style={styles.modal}>
              <View style={{ width: "80%" }}>
                <Calendar
                  current={bangCapDetail.ngaycap}
                  markedDates={{
                    [bangCapDetail.ngaycap]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedDotColor: "orange",
                    },
                  }}
                />
              </View>
            </View>
          </Modal>

          <View style={styles.card}>
            <Text style={styles.label}>Ảnh bằng cấp:</Text>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  bangCapDetail.imageUrl
                    ? { uri: bangCapDetail.imageUrl }
                    : require("../../../assets/image/images.png")
                }
                style={styles.avatar}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleXacThuc}>
            <Text style={styles.buttonText}>
              {bangCapDetail.xacthuc === "1" ? "Hủy xác thực" : "Xác thực"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 9,
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  textDetail: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  modal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
