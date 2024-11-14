// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../../config/AppProvider'; // Sử dụng Context
import { initializeFirebaseApp } from '../../config/firebaseconfig';
import { getEmployeeById } from '../../services/EmployeeFireBase'; // Giả sử bạn có dịch vụ này

export default function LoginScreen() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const { setCompanyId: setGlobalCompanyId } = useAppContext(); // Sử dụng Context để set companyId
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!employeeId || !password || !companyId) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Lưu companyId vào Context
    setGlobalCompanyId(companyId);

    try {
      // Khởi tạo Firebase với companyId
      const { database } = initializeFirebaseApp(companyId);

      const employeeData = await getEmployeeById(employeeId, database);
      if (employeeData && password === employeeData.matKhau) {
        navigation.navigate('UserTabNav', { employee: employeeData });
      } else {
        Alert.alert('Error', 'Invalid credentials.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Employee ID"
        value={employeeId}
        onChangeText={setEmployeeId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Company ID"
        value={companyId}
        onChangeText={setCompanyId}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 7,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#00BFFF",
    borderRadius: 20,
    height: 50,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
