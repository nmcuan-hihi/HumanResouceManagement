import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase, ref, get, child } from "firebase/database";
import { app } from '../../services/database'; 

const database = getDatabase(app);

export default function LoginScreen({ navigation }) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState(''); // Mock password input

  // Function to handle login and check role
  const handleLogin = async () => {
    if (!employeeId) {
      Alert.alert("Error", "Please enter your employee ID.");
      return;
    }

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `employees/${employeeId}`)); // Fetch employee data

      if (snapshot.exists()) {
        const employeeData = snapshot.val(); // Get employee data

        if (password === employeeData.matKhau) { // Assuming the password is stored as 'matKhau'
          if (employeeData.chucvuId === 'TP') { // Check if employee is a manager
            navigation.navigate('HomeScreenGD', { employee: employeeData }); // Navigate to ManagerScreen
          } else {
            navigation.navigate('UserTabNav', { employee: employeeData }); // Navigate to regular user screen
          }
        } else {
          Alert.alert("Error", "Incorrect password.");
        }
      } else {
        Alert.alert("Error", "Employee not found.");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      Alert.alert("Error", "An error occurred while logging in.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter your Employee ID</Text>
        <Ionicons style={{ marginEnd: 30 }} name="person-circle-outline" size={24} color="blue" />
      </View>

      <Text style={styles.subTitle}>
        Enter your employee ID and password to login.
      </Text>

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
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>

      {/* Test login buttons */}
      <View style={styles.testButtons}>
        <TouchableOpacity style={styles.testButton} onPress={() => handleLogin('NV')}>
          <Text style={styles.testButtonText}>Test as NV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={() => handleLogin('GD')}>
          <Text style={styles.testButtonText}>Test as GD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={() => handleLogin('KT')}>
          <Text style={styles.testButtonText}>Test as KT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.testButton} onPress={() => handleLogin('NS')}>
          <Text style={styles.testButtonText}>Test as NS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 100,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    color: 'blue',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 14,
    color: '#6e6e6e',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 7,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00BFFF',
    borderRadius: 20,
    height: 50,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButtons: {
    marginTop: 30,
  },
  testButton: {
    backgroundColor: '#d3d3d3',
    borderRadius: 15,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  testButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
