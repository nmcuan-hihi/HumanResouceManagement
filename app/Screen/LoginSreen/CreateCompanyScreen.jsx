// src/screens/CreateCompanyScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useCompany } from '../../config/AppProvider'; // Import context
import { ref, set } from 'firebase/database';
import { database } from '../../config/firebaseconfig';

const CreateCompanyScreen = () => {
  const { setCompanyId } = useCompany(); // Lấy setCompanyId từ context
  const [companyId, setLocalCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateCompany = () => {
    if (!companyId || !companyName || !password) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Lưu companyId vào context để dùng trong toàn bộ ứng dụng
    setCompanyId(companyId);

    // Tạo đường dẫn động cho Firebase Realtime Database
    const companyRef = ref(database, `/${companyId}/data/`);

    // Lưu dữ liệu công ty vào Firebase
    set(companyRef, {
      companyName,
      password,
    }).then(() => {
      Alert.alert('Thông báo', 'Công ty đã được tạo thành công!');
      // Reset form sau khi tạo công ty thành công
      setLocalCompanyId('');
      setCompanyName('');
      setPassword('');
    }).catch((error) => {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tạo công ty');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo Công Ty</Text>

      <TextInput
        style={styles.input}
        placeholder="ID Công Ty"
        value={companyId}
        onChangeText={setLocalCompanyId}
      />

      <TextInput
        style={styles.input}
        placeholder="Tên Công Ty"
        value={companyName}
        onChangeText={setCompanyName}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Tạo Công Ty" onPress={handleCreateCompany} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
});

export default CreateCompanyScreen;
