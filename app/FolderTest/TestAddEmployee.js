import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { writeUserData } from '../services/database';


export default function TestAddEmployee() {
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
    borderRadius: 20, 
    height: 50, 
    width: '80%', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
