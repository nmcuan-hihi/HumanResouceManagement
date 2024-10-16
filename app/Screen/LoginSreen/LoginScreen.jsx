// app/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { writeUserData, writeEmployeeList } from '../../services/database';

export default function LoginScreen() {
  const handlePress = () => {
    // Thêm dữ liệu mẫu vào Firebase
    writeUserData("user1232", "42");

    // Danh sách nhân viên mẫu
    const employees = [
      {
        cccd: "123456789",
        chucvuId: "CV001",
        employeeId: "EMP001",
        luongcobanId: "LCB001",
        name: "Nguyễn Văn A",
        ngaybatdau: "2024-01-01",
        ngaysinh: "1990-01-01",
        phongbanId: "PB001",
        sdt: "0123456789",
        trangthai: true,
      },
      {
        cccd: "987654321",
        chucvuId: "CV002",
        employeeId: "EMP002",
        luongcobanId: "LCB002",
        name: "Trần Thị B",
        ngaybatdau: "2024-02-01",
        ngaysinh: "1992-02-02",
        phongbanId: "PB002",
        sdt: "0987654321",
        trangthai: true,
      },
    ];

    // Ghi danh sách nhân viên vào Firebase
    writeEmployeeList(employees);
    console.log("Employee list added");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter your User</Text>
        <Ionicons style={{ marginEnd: 30 }} name="person-circle-outline" size={24} color="blue" />
      </View>

      <Text style={styles.subTitle}>
        Enter your mobile number to start using Gastos App.
      </Text>

      <TextInput style={styles.input} placeholder="XXX-XXXX-XXX" keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="XXX" secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 100, justifyContent: 'space-between', marginBottom: 20 },
  title: { color: 'blue', fontSize: 22, fontWeight: 'bold' },
  subTitle: { fontSize: 14, color: '#6e6e6e', marginBottom: 30 },
  input: { height: 50, borderColor: '#000', borderWidth: 2, borderRadius: 7, marginBottom: 20, paddingHorizontal: 10, fontSize: 16 },
  button: { backgroundColor: '#00BFFF', borderRadius: 20, height: 50, width: '80%', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', marginTop: 200 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
