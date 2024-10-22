import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createChucVu } from '../../services/database'; // Giả sử bạn có một hàm này để thêm chức vụ vào cơ sở dữ liệu

export default function AddChucVu({ navigation }) {
  const [maChucVu, setMaChucVu] = useState(''); // Thêm trường mã chức vụ

  const [tenChucVu, setTenChucVu] = useState('');
  const [heSoChucVu, setHeSoChucVu] = useState('');

  const handleAddChucVu = async () => {
    if (!maChucVu || !tenChucVu || !heSoChucVu) { // Kiểm tra mã chức vụ nữ
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    const chucVuData = {
      hschucvu: heSoChucVu,
      loaichucvu: tenChucVu,
      maChucVu: maChucVu, // Thêm mã chức vụ nữ vào dữ liệu
    };
  
    try {
      await createChucVu(maChucVu, chucVuData); // Gọi hàm với tham số chính xác
      Alert.alert("Thành công", "Thêm chức vụ thành công!");
      navigation.goBack(); // Quay lại màn hình trước đó
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình thêm chức vụ.");
    }
  };

  return (
    <View style={styles.container}>
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
        keyboardType="numeric" // Chỉ cho phép nhập số
      />
      <Button title="Thêm Chức Vụ" onPress={handleAddChucVu} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
