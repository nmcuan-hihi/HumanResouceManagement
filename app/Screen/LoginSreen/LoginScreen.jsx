// app/LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { writeUserData } from '../../services/database';

export default function LoginScreen() {
  const handlePress = () => {
    // Thêm dữ liệu mẫu vào Firebase
    writeUserData("user1232",  "qể982346580347502348wrwerwer" );
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
