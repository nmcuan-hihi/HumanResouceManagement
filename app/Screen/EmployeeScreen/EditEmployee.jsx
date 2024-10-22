import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { readEmployees, updateEmployee, toggleEmployeeStatus } from '../../services/database'; // Sử dụng toggleEmployeeStatus

export default function EmployeeEditScreen({ navigation, route }) {
  const { manv } = route.params;
  const [employeeData, setEmployeeData] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const data = await readEmployees();
      const employee = data[manv];
      if (employee) {
        setEmployeeData(employee);
      }
    };

    fetchEmployeeData();
  }, [manv]);

  const updateField = (field, value) => {
    setEmployeeData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || employeeData[dateField];
    setShowDatePicker(false);
    if (currentDate) {
      updateField(dateField, currentDate.toISOString().split('T')[0]); // Cập nhật trường ngày
    }
  };

  const showDatePickerModal = (field) => {
    setDateField(field);
    setShowDatePicker(true);
  };

  const handleUpdate = async () => {
    try {
      await updateEmployee(manv, employeeData);
      Alert.alert("Thông báo", "Cập nhật thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating employee:", error);
      Alert.alert("Thông báo", "Cập nhật không thành công!");
    }
  };

  // Hàm chuyển đổi trạng thái
  const handleToggleStatus = async () => {
    try {
      await toggleEmployeeStatus(manv, employeeData.trangthai); // Truyền trạng thái hiện tại
      Alert.alert("Thông báo", `Trạng thái đã được ${employeeData.trangthai ? 'ngưng hoạt động' : 'hoạt động lại'}!`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
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
            source={employeeData.imageURL ? { uri: employeeData.imageURL } : require("../../../assets/image/images.png")}
            style={styles.avatar}
          />
        </View>

        {/* Các trường dữ liệu khác */}
        <InputField label="Chọn phòng" value={employeeData.room} onChangeText={(value) => updateField('room', value)} isDropdown />
        <InputField label="Chức vụ" value={employeeData.position} onChangeText={(value) => updateField('position', value)} isDropdown />
        <InputField label="Mã Nhân Viên" value={employeeData.employee_id} onChangeText={(value) => updateField('employeeId', value)} />
        <InputField label="Họ Tên" value={employeeData.name} onChangeText={(value) => updateField('name', value)} />
        <InputField label="Mật khẩu" value={employeeData.matKhau} onChangeText={(value) => updateField('matKhau', value)} />

        {/* Trường Ngày sinh */}
        <TouchableOpacity onPress={() => showDatePickerModal('ngaysinh')} style={styles.datePicker}>
          <Text style={styles.label}>Ngày sinh</Text>
          <Text>{employeeData.ngaysinh || "Chọn ngày"}</Text>
        </TouchableOpacity>

        {/* Trường Ngày vào */}
        <TouchableOpacity onPress={() => showDatePickerModal('ngaybatdau')} style={styles.datePicker}>
          <Text style={styles.label}>Ngày vào</Text>
          <Text>{employeeData.ngaybatdau || "Chọn ngày"}</Text>
        </TouchableOpacity>

        <InputField label="Số điện thoại" value={employeeData.sdt} onChangeText={(value) => updateField('phone', value)} keyboardType="phone-pad" />
        <InputField label="Lương cơ bản" value={employeeData.luongcoban_id} onChangeText={(value) => updateField('salary', value)} keyboardType="numeric" />

        {/* Nút chuyển đổi trạng thái */}
        <TouchableOpacity style={employeeData.trangthai ? styles.deleteButton : styles.updateButton} onPress={handleToggleStatus}>
          <Text style={styles.deleteButtonText}>{employeeData.trangthai ? 'Ngưng hoạt động' : 'Hoạt động lại'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Cập Nhật</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(employeeData[dateField])}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const InputField = ({ label, value, onChangeText, isDropdown }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={isDropdown ? `Chọn ${label}` : `Nhập ${label}`}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    margin: 10,
  },
  scrollView: {
    padding: 10,
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  datePicker: {
    marginVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
