import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  
  // Hàm điều hướng theo role
  const handleLogin = (role) => {
    navigation.navigate('UserTabNav', { role }); // Chuyển role vào params
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

      {/* Nút đăng nhập gốc */}
      <TouchableOpacity style={styles.button} onPress={() => handleLogin('NV')}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>

      {/* Nút test login cho từng role */}
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
