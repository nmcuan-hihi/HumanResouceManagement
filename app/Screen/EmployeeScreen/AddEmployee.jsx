import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { writeEmployeeData } from '../../services/database';

export default function AddEmployeeScreen() {
  const [employeeData, setEmployeeData] = useState({
    employeeId: '',
    name: '',
    cccd: '',
    chucvu_id: '',
    luongcoban_id: '',
    ngaybatdau: '',
    ngaysinh: '',
    phongban_id: '',
    sdt: '',
    trangthai: true, // Mặc định trạng thái là true
  });

  const handleInputChange = (field, value) => {
    setEmployeeData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    writeEmployeeData(employeeData); // Ghi thông tin nhân viên vào Firebase
    // Thực hiện các hành động cần thiết sau khi ghi dữ liệu thành công, ví dụ: điều hướng về màn hình trước đó
    console.log("Employee added:", employeeData);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Mã Nhân Viên"
        value={employeeData.employeeId}
        onChangeText={(value) => handleInputChange('employeeId', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={employeeData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="CCCD"
        value={employeeData.cccd}
        onChangeText={(value) => handleInputChange('cccd', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Chức vụ ID"
        value={employeeData.chucvu_id}
        onChangeText={(value) => handleInputChange('chucvu_id', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Lương cơ bản ID"
        value={employeeData.luongcoban_id}
        onChangeText={(value) => handleInputChange('luongcoban_id', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ngày bắt đầu"
        value={employeeData.ngaybatdau}
        onChangeText={(value) => handleInputChange('ngaybatdau', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ngày sinh"
        value={employeeData.ngaysinh}
        onChangeText={(value) => handleInputChange('ngaysinh', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phòng ban ID"
        value={employeeData.phongban_id}
        onChangeText={(value) => handleInputChange('phongban_id', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={employeeData.sdt}
        onChangeText={(value) => handleInputChange('sdt', value)}
      />
      <Button title="Thêm Nhân Viên" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
});
