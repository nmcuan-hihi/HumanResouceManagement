import React, { useEffect, useState } from "react";
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
  Modal,
} from "react-native";
import {
  readEmployees,
  updateEmployee,
  toggleEmployeeStatus,
  readPhongBan1,
  readChucVu,
  editPhongBan,
} from "../../services/database";
import RNPickerSelect from "react-native-picker-select";
import BackNav from "../../Compoment/BackNav";
import { readEmployeesFireStore, getEmployeeById } from "../../services/EmployeeFireBase";
import { validateEmployeeData } from '../../utils/validate'; 
import { Calendar } from "react-native-calendars";

export default function EmployeeEditScreen({ navigation, route }) {
  const { manv } = route.params;
  const [employeeData, setEmployeeData] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateField, setDateField] = useState("");
  const [phongBans, setPhongBans] = useState([]);
  const [chucVus, setChucVus] = useState([]);
  const [currentNV, setCurrentNV] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const employee = await getEmployeeById(manv);
      if (employee) {
        setEmployeeData(employee);
        setCurrentNV(employee);
      }
    };

    const fetchDropdownData = async () => {
      const phongBanData = await readPhongBan1();
      setPhongBans(phongBanData);
      const chucVuData = await readChucVu();
      setChucVus(chucVuData);
    };

    fetchEmployeeData();
    fetchDropdownData();
  }, [manv]);

  const updateField = (field, value) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (day) => {
    updateField(dateField, day.dateString);
    setShowCalendar(false);
  };

  const showCalendarModal = (field) => {
    setDateField(field);
    setShowCalendar(true);
  };

  const handleUpdate = async () => {
    const isValid = validateEmployeeData(employeeData);
    if (!isValid) {
      Alert.alert("Thông báo", "Vui lòng kiểm tra dữ liệu nhập!");
      return;
    }
    try {
      const currentPhongBan = phongBans.find((pb) => pb.maPhongBan == currentNV.phongbanId);
      const newPhongBan = phongBans.find((pb) => pb.maPhongBan == employeeData.phongbanId);

      if (currentNV.chucvuId !== "TP") {
        if (employeeData.chucvuId === "TP") {
          await editPhongBan(employeeData.phongbanId, { maQuanLy: manv });
          if (newPhongBan.maQuanLy !== "")
            await updateEmployee(newPhongBan.maQuanLy, { chucvuId: "NV" });
        }
      } else {
        if (employeeData.chucvuId !== "TP") {
          await editPhongBan(currentNV.phongbanId, { maQuanLy: "" });
        } else if (currentNV.phongbanId !== employeeData.phongbanId) {
          Alert.alert(
            "Thông báo",
            `Không thể đổi sang phòng ${newPhongBan.tenPhongBan}, Bạn đang là trưởng phòng ${currentPhongBan.tenPhongBan}!`
          );
          return;
        }
      }
      await updateEmployee(manv, employeeData);
      Alert.alert("Thông báo", `Cập nhật thành công!`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating employee:", error);
      Alert.alert("Thông báo", "Cập nhật không thành công!");
    }
  };

  const handleToggleStatus = async () => {
    try {
      await toggleEmployeeStatus(manv, employeeData.trangthai);
      Alert.alert(
        "Thông báo",
        `Trạng thái đã được ${employeeData.trangthai ? "ngưng hoạt động" : "hoạt động lại"}!`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error toggling employee status:", error);
      Alert.alert("Thông báo", "Cập nhật trạng thái không thành công!");
    }
  };

  if (!employeeData) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <View style={styles.header}>
        <BackNav
          navigation={navigation}
          name={"Chỉnh Sửa"}
          btn={"Sửa"}
          onEditPress={handleUpdate}
        />
      </View>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.avatarContainer}>
            <Image
              source={employeeData.imageURL
                ? { uri: employeeData.imageURL }
                : require("../../../assets/image/images.png")}
              style={styles.avatar} />
          </View>
          <RNPickerSelect
            onValueChange={(itemValue) => updateField("phongbanId", itemValue)}
            items={phongBans.map((phong) => ({
              label: phong.tenPhongBan,
              value: phong.maPhongBan,
            }))}
            value={employeeData.phongbanId}
            placeholder={{ label: "Chọn phòng", value: "" }}
            style={pickerSelectStyles} />

          <RNPickerSelect
            onValueChange={(itemValue) => updateField("chucvuId", itemValue)}
            items={Object.entries(chucVus).map(([key, value]) => ({
              label: value.loaichucvu,
              value: key,
            }))}
            value={employeeData.chucvuId}
            placeholder={{ label: "Chọn chức vụ", value: "" }}
            style={pickerSelectStyles} />

          <InputField
            label="Mã Nhân Viên"
            value={employeeData.employeeId}
            onChangeText={(value) => updateField("employeeId", value)} />
          <InputField
            label="Họ Tên"
            value={employeeData.name}
            onChangeText={(value) => updateField("name", value)} />
          <InputField
            label="Mật khẩu"
            value={employeeData.matKhau}
            onChangeText={(value) => updateField("matKhau", value)} />

          <TouchableOpacity onPress={() => showCalendarModal("ngaysinh")} style={styles.datePicker}>
            <Text style={styles.label}>Ngày sinh</Text>
            <Text>{employeeData.ngaysinh || "Chọn ngày"}</Text>
          </TouchableOpacity>

          <RNPickerSelect
            value={employeeData.gioitinh}
            onValueChange={(value) => updateField("gioitinh", value)}
            items={[
              { label: "Nam", value: "Nam" },
              { label: "Nữ", value: "Nữ" },
              { label: "Khác", value: "Khác" },
            ]}
            placeholder={{ label: "Chọn giới tính", value: "" }}
            style={pickerSelectStyles} />

          <TouchableOpacity onPress={() => showCalendarModal("ngaybatdau")} style={styles.datePicker}>
            <Text style={styles.label}>Ngày vào</Text>
            <Text>{employeeData.ngaybatdau || "Chọn ngày"}</Text>
          </TouchableOpacity>

          <InputField
            label="Số điện thoại"
            value={employeeData.sdt}
            onChangeText={(value) => updateField("sdt", value)}
            keyboardType="phone-pad" />
          <InputField
            label="Lương cơ bản"
            value={employeeData.luongcoban}
            onChangeText={(value) => updateField("luongcoban", value)}
            keyboardType="numeric" />

          <TouchableOpacity
            style={employeeData.trangthai ? styles.deleteButton : styles.updateButton}
            onPress={handleToggleStatus}
          >
            <Text style={styles.deleteButtonText}>
              {employeeData.trangthai ? "Ngưng hoạt động" : "Hoạt động lại"}
            </Text>
          </TouchableOpacity>

          {/* Modal cho Calendar */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showCalendar}
            onRequestClose={() => setShowCalendar(false)}
          >
            <View style={styles.modalContainer}>
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [employeeData[dateField]]: { selected: true, marked: true },
                }}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.closeButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
const InputField = ({ label, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 20,
  },
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFF",
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePicker: {
    marginBottom: 20,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "flex-start",
  },
  updateButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF5733",
    padding: 15,
    marginBottom: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    marginBottom: 5,
    color: "#FFFFFF",
    fontSize: 16,
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
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});
