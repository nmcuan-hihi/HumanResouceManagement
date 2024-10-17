// app/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { writeUserData } from '../../services/database';

export default function LoginScreen({navigation}) {
  const handlePress1 = () => {
    navigation.navigate('EmployeeScreen');
  };
  const handlePress = () => {

    const employee = {
      cccd: "123456789",
      chucvuId: "CV001",
      employeeId: "EMP01",
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
      <View style={styles.header}>
        <Text style={styles.title}>Enter your User</Text>
        <Ionicons style={{ marginEnd: 30 }} name="person-circle-outline" size={24} color="blue" />
      </View>

      <Text style={styles.subTitle}>
        Enter your mobile number to start using Gastos App.
      </Text>

      <TextInput style={styles.input} placeholder="XXX-XXXX-XXX" keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="XXX" secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handlePress1}>
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
