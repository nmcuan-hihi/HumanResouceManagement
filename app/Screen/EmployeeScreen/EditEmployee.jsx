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
} from "react-native";
import {
  readEmployees,
  updateEmployee,
  toggleEmployeeStatus,
  readPhongBan1,
  readChucVu,
  getEmployeeById,
  editPhongBan,
} from "../../services/database";
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from "react-native-picker-select";
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
      const data = await readEmployees();
      const employee = data[manv];
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
    try {
      const currentPhongBan = phongBans.find((pb) => pb.maPhongBan == currentNV.phongbanId);
      const newPhongBan = phongBans.find((pb) => pb.maPhongBan == employeeData.phongbanId);

      if (currentNV.chucvuId != "TP") {
        if (employeeData.chucvuId == "TP") {
          await editPhongBan(employeeData.phongbanId, { maQuanLy: manv });

          if (newPhongBan.maQuanLy != "")
            await updateEmployee(newPhongBan.maQuanLy, { chucvuId: "NV" });
        }

        await updateEmployee(manv, employeeData);

        Alert.alert("Thông báo", `Cập nhật thành công!`, [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        if (employeeData.chucvuId != "TP") {
          await editPhongBan(currentNV.phongbanId, { maQuanLy: "" });
          await updateEmployee(manv, employeeData);
          Alert.alert("Thông báo", `Cập nhật thành công!`, [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else if (currentNV.phongbanId == employeeData.phongbanId) {
          await updateEmployee(manv, employeeData);
          Alert.alert("Thông báo", `Cập nhật thành công!`, [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert(
            "Thông báo",
            `Không thể đổi sang phòng ${newPhongBan.tenPhongBan}, Bạn đang là trưởng phòng ${currentPhongBan.tenPhongBan}!`
          );
        }
      }
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.avatarContainer}>
          <Image
            source={
              employeeData.imageURL
                ? { uri: employeeData.imageURL }
                : require("../../../assets/image/images.png")
            }
            style={styles.avatar}
          />
        </View>
        <RNPickerSelect
          onValueChange={(itemValue) => updateField("phongbanId", itemValue)}
          items={phongBans.map((phong) => ({
            label: phong.tenPhongBan,
            value: phong.maPhongBan,
          }))}
          value={employeeData.phongbanId}
          placeholder={{ label: "Chọn phòng", value: "" }}
          style={pickerSelectStyles}
        />

        <RNPickerSelect
          onValueChange={(itemValue) => updateField("chucvuId", itemValue)}
          items={Object.entries(chucVus).map(([key, value]) => ({
            label: value.loaichucvu,
            value: key,
          }))}
          value={employeeData.chucvuId}
          placeholder={{ label: "Chọn chức vụ", value: "" }}
          style={pickerSelectStyles}
        />

        <InputField
          label="Mã Nhân Viên"
          value={employeeData.employeeId}
          onChangeText={(value) => updateField("employeeId", value)}
        />
        <InputField
          label="Họ Tên"
          value={employeeData.name}
          onChangeText={(value) => updateField("name", value)}
        />
        <InputField
          label="Mật khẩu"
          value={employeeData.matKhau}
          onChangeText={(value) => updateField("matKhau", value)}
        />

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
          style={pickerSelectStyles}
        />

        <TouchableOpacity onPress={() => showCalendarModal("ngaybatdau")} style={styles.datePicker}>
          <Text style={styles.label}>Ngày vào</Text>
          <Text>{employeeData.ngaybatdau || "Chọn ngày"}</Text>
        </TouchableOpacity>

        <InputField
          label="Số điện thoại"
          value={employeeData.sdt}
          onChangeText={(value) => updateField("phone", value)}
          keyboardType="phone-pad"
        />
        <InputField
          label="Lương cơ bản"
          value={employeeData.luongcoban}
          onChangeText={(value) => updateField("luongcoban", value)}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={employeeData.trangthai ? styles.deleteButton : styles.updateButton}
          onPress={handleToggleStatus}
        >
          <Text style={styles.deleteButtonText}>
            {employeeData.trangthai ? "Ngưng hoạt động" : "Hoạt động lại"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Cập Nhật</Text>
        </TouchableOpacity>

        {showCalendar && (
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{ [employeeData[dateField]]: { selected: true } }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const InputField = ({ label, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={`Nhập ${label}`}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    margin: 10,
  },
  scrollView  : {
    paddingVertical: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E3E3E3",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DADADA",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
  },
  datePicker: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#DADADA",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#DADADA",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  updateButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
});

