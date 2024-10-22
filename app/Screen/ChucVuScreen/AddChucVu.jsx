import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { createChucVu } from '../../services/database'; // Giả sử bạn có một hàm này để thêm chức vụ vào cơ sở dữ liệu

export default function AddChucVu({ navigation }) {
  const [maChucVu, setMaChucVu] = useState('');
  const [tenChucVu, setTenChucVu] = useState('');
  const [heSoChucVu, setHeSoChucVu] = useState('');

  const handleAddChucVu = async () => {
    if (!maChucVu || !tenChucVu || !heSoChucVu) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    const chucVuData = {
      hschucvu: heSoChucVu,
      loaichucvu: tenChucVu,
      maChucVu: maChucVu,
    };
  
    try {
      await createChucVu(maChucVu, chucVuData);
      Alert.alert("Thành công", "Thêm chức vụ thành công!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình thêm chức vụ.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Chức Vụ</Text>

      <TextInput
        style={styles.input}
        placeholder="Mã Chức Vụ"
        value={maChucVu}
        onChangeText={setMaChucVu}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Tên Chức Vụ"
        value={tenChucVu}
        onChangeText={setTenChucVu}
      />
      <TextInput
        style={styles.input}
        placeholder="Hệ Số Chức Vụ"
        value={heSoChucVu}
        onChangeText={setHeSoChucVu}
        keyboardType="numeric"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleAddChucVu}>
        <Text style={styles.buttonText}>Thêm Chức Vụ</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>Hủy Bỏ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
