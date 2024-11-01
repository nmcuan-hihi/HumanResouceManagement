import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import BackNav from "../../Compoment/BackNav";
import RNPickerSelect from "react-native-picker-select";
import { Calendar } from "react-native-calendars";

import {
  editPhongBan,
  readChucVu,
  readPhongBan,
  updateEmployee,
} from "../../services/database";
import ViewLoading, {
  openModal,
  closeModal,
} from "../../Compoment/ViewLoading";
import {
  editEmployeeFireStore,
  getEmployeeById,
  updateEmployeeFireStore,
} from "../../services/EmployeeFireBase"; // Hàm cập nhật
import { validateEmployeeData } from "../../services/validate";

export default function EditMember({ route, navigation }) {
  const { manv } = route.params || {}; // Nhận dữ liệu từ params

  const [employeeData, setEmployeeData] = useState({
    cccd: "",
    employeeId: "",
    name: "",
    diachi: "",
    sdt: "",
    gioitinh: "Nam",
    phongbanId: "",
    chucvuId: "",
    luongcoban: "",
    ngaysinh: "",
    ngaybatdau: "",
    matKhau: "",
    trangthai: "true",
    imageUrl: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [phongBans, setPhongBans] = useState([]);
  const [chucVus, setChucVus] = useState([]);
  const [dateField, setDateField] = useState("");

  const [phongBanUpDate, setPhongBanUpDate] = useState([]);

  const [currentNV, setCurrentNV] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Lấy thông tin nhân viên khi component được mount
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employee = await getEmployeeById(manv);
        setEmployeeData({
          cccd: employee?.cccd || "",
          employeeId: employee?.employeeId || "",
          name: employee?.name || "",
          diachi: employee?.diachi || "",
          sdt: employee?.sdt || "",
          gioitinh: employee?.gioitinh || "Nam",
          phongbanId: employee?.phongbanId || "",
          chucvuId: employee?.chucvuId || "",
          luongcoban: employee?.luongcoban || "",
          ngaysinh: employee?.ngaysinh || "",
          ngaybatdau: employee?.ngaybatdau || "",
          matKhau: employee?.matKhau || "",
          trangthai: employee?.trangthai || "true",
          imageUrl: employee?.imageUrl || "",
        });
        setProfileImage(employee?.imageUrl || null); // Set hình ảnh hồ sơ

        setCurrentNV(employee);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhân viên:", error);
      }
    };

    fetchEmployeeData();
  }, [manv]); // Chạy lại khi manv thay đổi

  const handleDateSelect = (day) => {
    updateField(dateField, day.dateString);
    setShowCalendar(false);
  };

  const showCalendarModal = (field) => {
    setDateField(field);
    setShowCalendar(true);
  };

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Quyền bị từ chối!", "Vui lòng cấp quyền để chọn ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Cập nhật trường dữ liệu
  const updateField = (field, value) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  // Xử lý cập nhật nhân viên

  const handleEditEmployee = async () => {
    try {
      // Validate employee data
      const errors = validateEmployeeData(employeeData);
      if (errors.length > 0) {
        Alert.alert("Lỗi", errors.join("\n")); // Hiển thị tất cả lỗi trong một thông báo
        return;
      }

      openModal();
      // Kiểm tra xem hình ảnh đã thay đổi chưa
      const imageToUpload =
        profileImage !== employeeData.imageUrl ? profileImage : null;

      // lấy phòng ban hiện tại
      const currentPhongBan = phongBanUpDate.find((pb) => {
        return pb.maPhongBan == currentNV.phongbanId;
      });

      // lấy phòng ban được chọn
      const newPhongBan = phongBanUpDate.find((pb) => {
        return pb.maPhongBan == employeeData.phongbanId;
      });

      console.log(newPhongBan, "newpb");
      if (currentNV.chucvuId != "TP") {
        console.log("1---");

        if (employeeData.chucvuId == "TP") {
          console.log("2---");

          await editPhongBan(employeeData.phongbanId, { maQuanLy: manv });

          if (newPhongBan.maQuanLy != "") {
            await updateEmployee(newPhongBan.maQuanLy, { chucvuId: "NV" });
          }
        }
        console.log("4---");

        await editEmployeeFireStore(employeeData, imageToUpload); // Cập nhật vào Firestore
        console.log("4.1---");

        closeModal();
        Alert.alert("Thông báo", `Cập nhật thành công!`, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        if (employeeData.chucvuId != "TP") {
          await editPhongBan(currentNV.phongbanId, { maQuanLy: "" });
          await editEmployeeFireStore(employeeData, imageToUpload); // Cập nhật vào Firestore
          closeModal();

          Alert.alert("Thông báo", `Cập nhật thành công!`, [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else if (currentNV.phongbanId == employeeData.phongbanId) {
          await editEmployeeFireStore(employeeData, imageToUpload); // Cập nhật vào Firestore
          closeModal();

          Alert.alert("Thông báo", `Cập nhật thành công!`, [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          closeModal();

          Alert.alert(
            "Thông báo",
            `Không thể đổi sang phòng ${newPhongBan.tenPhongBan}, Bạn đang là trưởng phòng ${currentPhongBan.tenPhongBan}!`
          );
        }
      }
    } catch (error) {
      closeModal();

      console.error("Error updating employee 11111:", error);
      Alert.alert("Thông báo", "Cập nhật không thành công!");
    }
  };

  const toggleTrangThai = () => {
    const currentStatus = employeeData.trangthai === "true";
    const newStatus = !currentStatus;
    const message = newStatus
      ? "Bạn có muốn bật hoạt động không?"
      : "Bạn có muốn tắt hoạt động không?";

    Alert.alert("Xác nhận", message, [
      { text: "Không", style: "cancel" },
      {
        text: "Có",
        onPress: () => updateField("trangthai", newStatus ? "true" : "false"),
      },
    ]);
  };
  // Lấy dữ liệu phòng ban và chức vụ từ Firestore
  useEffect(() => {
    const fetchPhongBan = async () => {
      try {
        const data = await readPhongBan();
        if (data) {
          const phongBanArray = Object.values(data).map((p) => ({
            label: p.tenPhongBan,
            value: p.maPhongBan,
          }));

          setPhongBans(phongBanArray);
          const phongBanUpdate = Object.values(data);

          setPhongBanUpDate(phongBanUpdate);
        }
      } catch (error) {
        console.error("Lỗi khi lấy phòng ban:", error);
      }
    };

    const fetchChucVu = async () => {
      try {
        const data = await readChucVu();
        if (data) {
          const chucVuArr = Object.values(data).map((p) => ({
            label: p.loaichucvu,
            value: p.chucvu_id,
          }));
          setChucVus(chucVuArr);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chức vụ:", error);
      }
    };

    fetchPhongBan();
    fetchChucVu();
  }, []);

  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Edit Member"}
        btn={"Lưu"}
        onEditPress={handleEditEmployee}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <SafeAreaView>
          <ScrollView style={{ paddingHorizontal: 15 }}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require("../../../assets/image/images.png")
                  }
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Mã số CCCD</Text>
            <TextInput
              style={styles.input}
              value={employeeData.cccd}
              onChangeText={(value) => updateField("cccd", value)}
            />

            <Text style={styles.label}>Mã Nhân Viên</Text>
            <TextInput
              style={styles.input}
              value={employeeData.employeeId}
              editable={false}
            />

            <Text style={styles.label}>Họ Tên</Text>
            <TextInput
              style={styles.input}
              value={employeeData.name}
              onChangeText={(value) => updateField("name", value)}
            />

            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={employeeData.diachi}
              onChangeText={(value) => updateField("diachi", value)}
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={employeeData.sdt}
              onChangeText={(value) => updateField("sdt", value)}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Giới tính</Text>
            <RNPickerSelect
              onValueChange={(value) => updateField("gioitinh", value)}
              value={employeeData.gioitinh}
              items={[
                { label: "Nam", value: "Nam" },
                { label: "Nữ", value: "Nữ" },
                { label: "Khác", value: "Khác" },
              ]}
              style={pickerSelectStyles}
            />

            <Text style={styles.label}>Phòng ban</Text>
            <RNPickerSelect
              onValueChange={(value) => updateField("phongbanId", value)}
              value={employeeData.phongbanId}
              items={phongBans}
              style={pickerSelectStyles}
            />

            <Text style={styles.label}>Chức vụ</Text>
            <RNPickerSelect
              onValueChange={(value) => updateField("chucvuId", value)}
              value={employeeData.chucvuId}
              items={chucVus}
              style={pickerSelectStyles}
            />

            <TouchableOpacity onPress={() => showCalendarModal("ngaysinh")}>
              <Text style={styles.label}>Ngày sinh</Text>
              <View style={styles.datePicker}>
                <Text>{employeeData.ngaysinh || "Chọn ngày"}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => showCalendarModal("ngaybatdau")}>
              <Text style={styles.label}>Ngày vào</Text>
              <View style={styles.datePicker}>
                <Text>{employeeData.ngaybatdau || "Chọn ngày"}</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.label}>Lương cơ bản</Text>
            <TextInput
              style={styles.input}
              value={employeeData.luongcoban}
              onChangeText={(value) => updateField("luongcoban", value)}
            />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={employeeData.matKhau}
              onChangeText={(value) => updateField("matKhau", value)}
              secureTextEntry
            />

            <Text style={styles.label}>Trạng thái</Text>
            <TouchableOpacity
              style={styles.statusContainer}
              onPress={toggleTrangThai}
            >
              <Text style={styles.statusText}>
                {employeeData.trangthai === "true"
                  ? "Đang hoạt động"
                  : "Không hoạt động"}
              </Text>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      employeeData.trangthai === "true" ? "green" : "red",
                  },
                ]}
              />
            </TouchableOpacity>

            {/* Modal cho Calendar */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={showCalendar}
              onRequestClose={() => setShowCalendar(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={{
                      [employeeData[dateField]]: { selected: true },
                    }}
                  />
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowCalendar(false)}
                  >
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <ViewLoading />
    </>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statusText: { fontSize: 16, marginRight: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  container: {
    flex: 15,
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  datePicker: {
    marginBottom: 20,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "flex-start",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10, // Khoảng cách từ trên xuống
    right: 15, // Khoảng cách từ bên phải
    alignSelf: "flex-end",
    backgroundColor: "red",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black", // Màu chữ
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black", // Màu chữ
    marginBottom: 15,
  },

  datePicker: {
    marginBottom: 20,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "flex-start",
  },
};
