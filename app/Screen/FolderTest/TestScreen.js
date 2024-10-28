import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { writeUserData } from '../../services/database';
import { getNewEmployeeId ,addEmployeeFireStore} from '../../services/EmployeeFireBase';

export default function TestScreen({ navigation }) {
  // Hàm để thêm nhân viên vào Firebase
  const handleAddEmployee = () => {
    const employee = {
      employeeId: "NV000",
      name: "Nguyễn Văn Hậu", // Tên nhân viên
      gioitinh: "Nam", // Giới tính
      ngaysinh: "21/06/1990", // Ngày sinh  
      cccd: "34123423", // Căn cước công dân
      sdt: "0123456789", // Số điện thoại phụ     
      diachi: "Binh Dong", // Địa chỉ
      chucvuId: "TP", // Mã chức vụ
      phongbanId: "NS", // Mã phòng ban
      ngaybatdau: "21/06/2010", // Ngày bắt đầu làm việc
      luongcoban: "10000000", // Lương cơ bản
      matKhau: "1", // Mật khẩu
      trangthai: true, // Trạng thái hoạt động
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/hrm-pj-team3.appspot.com/o/employee%2FDUC001.jpg?alt=media&token=c9d94d3c-f955-4430-8da1-7154ae1b50e8", // URL ảnh nhân viên
    };
    // Ghi nhân viên vào Firebase
    addEmployeeFireStore(employee);

  
  };

  // Hàm điều hướng đến các màn hình khác
  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleAddEmployee}>
        <Text style={styles.buttonText}>Add Employee</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  button: { 
    backgroundColor: '#00BFFF', 
    borderRadius: 5, 
    height: 50, 
    width: '80%', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginVertical: 10 // Thêm khoảng cách giữa các nút
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
