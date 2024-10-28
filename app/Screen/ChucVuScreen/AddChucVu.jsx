import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { createChucVu } from '../../services/database'; // Giả sử bạn có một hàm này để thêm chức vụ vào cơ sở dữ liệu
import BackNav from '../../Compoment/BackNav';

export default function AddChucVu({ navigation }) {
  const [chucvu_id
    , setchucvu_id] = useState('');
  const [tenChucVu, setTenChucVu] = useState('');
  const [heSoChucVu, setHeSoChucVu] = useState('');

  const handleAddChucVu = async () => {
    if (!chucvu_id || !tenChucVu || !heSoChucVu) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    const chucVuData = {
      chucvu_id: chucvu_id,
      hschucvu: heSoChucVu,
      loaichucvu: tenChucVu
    };
  
    try {
      await createChucVu(chucvu_id, chucVuData);
      Alert.alert("Thành công", "Thêm chức vụ thành công!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình thêm chức vụ.");
    }
  };

  return (
    <><BackNav
      navigation={navigation}
      name={"Danh sách chức vụ"} /><View style={styles.container}>
        <View style={styles.headerSection}>


        </View>
     

        <TextInput
          style={styles.input}
          placeholder="Mã Chức Vụ"
          value={chucvu_id}
          onChangeText={setchucvu_id} />

        <TextInput
          style={styles.input}
          placeholder="Tên Chức Vụ"
          value={tenChucVu}
          onChangeText={setTenChucVu} />
        <TextInput
          style={styles.input}
          placeholder="Hệ Số Chức Vụ"
          value={heSoChucVu}
          onChangeText={setHeSoChucVu}
          keyboardType="numeric" />

        <TouchableOpacity style={styles.button} onPress={handleAddChucVu}>
          <Text style={styles.buttonText}>Thêm Chức Vụ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Hủy Bỏ</Text>
        </TouchableOpacity>
      </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 15,
    backgroundColor: '#fff',
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
