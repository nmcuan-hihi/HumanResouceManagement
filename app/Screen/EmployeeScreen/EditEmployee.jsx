import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { readEmployees, updateEmployee, deleteEmployee } from '../../services/database'; // Nhập hàm đọc, cập nhật và xóa dữ liệu

export default function EmployeeEditScreen({ navigation, route }) {
  const { manv } = route.params; // Nhận mã nhân viên từ params
  const [employeeData, setEmployeeData] = useState(null); // State để lưu dữ liệu nhân viên

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const data = await readEmployees(); // Đọc dữ liệu từ Firebase
      const employee = data[manv]; // Tìm nhân viên dựa trên mã nhân viên
      if (employee) {
        setEmployeeData(employee); // Cập nhật state với dữ liệu nhân viên
      }
    };

    fetchEmployeeData(); // Gọi hàm để đọc dữ liệu nhân viên
  }, [manv]); // Chạy khi manv thay đổi

  const updateField = (field, value) => {
    setEmployeeData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateEmployee(manv, employeeData); // Cập nhật dữ liệu nhân viên vào Firebase
      Alert.alert("Thông báo", "Cập nhật thành công!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error("Error updating employee:", error);
      Alert.alert("Thông báo", "Cập nhật không thành công!");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(manv); // Xóa nhân viên khỏi Firebase
      Alert.alert("Thông báo", "Xóa thành công!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error("Error deleting employee:", error);
      Alert.alert("Thông báo", "Xóa không thành công!");
    }
  };

  // Nếu dữ liệu nhân viên chưa được tải, hiển thị loading hoặc gì đó tương tự
  if (!employeeData) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.avatarContainer}>
          <Image
            source={employeeData.imageURL ? { uri: employeeData.imageURL } : require("../../../assets/image/images.png")}
            style={styles.avatar}
          />
        </View>

        {/* Sử dụng InputField cho các trường dữ liệu */}
        <InputField label="Chọn phòng" value={employeeData.room} onChangeText={(value) => updateField('room', value)} isDropdown />
        <InputField label="Chức vụ" value={employeeData.position} onChangeText={(value) => updateField('position', value)} isDropdown />
        <InputField label="Mật Khẩu" value={employeeData.password} onChangeText={(value) => updateField('password', value)} secureTextEntry />
        <InputField label="Mã Nhân Viên" value={employeeData.employeeId} onChangeText={(value) => updateField('employeeId', value)} />
        <InputField label="Họ Tên" value={employeeData.name} onChangeText={(value) => updateField('name', value)} />
        <InputField label="Địa chỉ" value={employeeData.address} onChangeText={(value) => updateField('address', value)} />
        <InputField label="Ngày sinh" value={employeeData.ngaysinh} onChangeText={(value) => updateField('birthDate', value)} />
        <InputField label="Số điện thoại" value={employeeData.sdt} onChangeText={(value) => updateField('phone', value)} keyboardType="phone-pad" />
        <InputField label="Lương cơ bản" value={employeeData.luongcoban_id} onChangeText={(value) => updateField('salary', value)} keyboardType="numeric" />
        <InputField label="Ngày vào" value={employeeData.ngaybatdau} onChangeText={(value) => updateField('joinDate', value)} />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Cập Nhật</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const InputField = ({ label, value, onChangeText, isDropdown, secureTextEntry, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    {isDropdown ? (
      // Nếu là dropdown, sử dụng Picker (cần nhập 'react-native-picker-select')
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Chọn ${label}`}
      />
    ) : (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={`Nhập ${label}`}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    margin: 10,
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
