import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { writeUserData } from '../services/database';

export default function TestScreen({ navigation }) {
  // Hàm để thêm nhân viên vào Firebase
  const handleAddEmployee = () => {
    const employee = {
      cccd: "123456789",
      chucvuId: "CV001",
      employeeId: "EMP001X",
      luongcobanId: "LCB001",
      name: "Nguyễn Văn A",
      ngaybatdau: "2024-01-01",
      ngaysinh: "1990-01-01",
      phongbanId: "PB001",
      sdt: "0123456789",
      trangthai: true,
      imageURL: "https://firebasestorage.googleapis.com/v0/b/hrm-pj-team3.appspot.com/o/employee%2Fstar.jpg?alt=media&token=cb1f939b-ecab-4066-b7fd-6f75a7934126" // Thêm imageURL
    };

    // Ghi nhân viên vào Firebase
    writeUserData(employee);
    console.log("Employee added");
    // Điều hướng đến màn hình
    navigation.navigate('ChamCong');
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

      {/* Các nút điều hướng đến các màn hình khác */}
      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('ChamCong')}>
        <Text style={styles.buttonText}>Cham Cong</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('ListEmployee')}>
        <Text style={styles.buttonText}>List Employee</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('EmployeeDetail')}>
        <Text style={styles.buttonText}>Employee Detail</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('EditEmployee')}>
        <Text style={styles.buttonText}>Edit Employee</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('PhongBanScreen')}>
        <Text style={styles.buttonText}>Phong Ban</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigateToScreen('TeamMember')}>
        <Text style={styles.buttonText}>Team Member</Text>
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
