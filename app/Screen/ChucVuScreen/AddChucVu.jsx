import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { createChucVu } from '../../services/database'; // Assuming this function adds the position to the database
import BackNav from '../../Compoment/BackNav';
import { validateChucVuData } from '../../utils/validate'; // Import the validation function

export default function AddChucVu({ navigation }) {
  const [chucvu_id, setChucVuId] = useState('');
  const [tenChucVu, setTenChucVu] = useState('');
  const [heSoChucVu, setHeSoChucVu] = useState('');
  const [errors, setErrors] = useState([]);

  const handleAddChucVu = async () => {
    // Validate inputs
    const validationErrors = validateChucVuData({ chucvu_id, loaichucvu: tenChucVu, hschucvu: heSoChucVu });
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors([]); // Clear previous errors
    }

    const chucVuData = {
      chucvu_id,
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
    <>
      <BackNav navigation={navigation} name={"Danh sách chức vụ"} />
      <View style={styles.container}>
        <View style={styles.headerSection}></View>

        <TextInput
          style={styles.input}
          placeholder="Mã Chức Vụ"
          value={chucvu_id}
          onChangeText={setChucVuId} />
        
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
        
        {/* Display validation errors */}
        {errors.length > 0 && (
          <View style={styles.errorContainer}>
            {errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>{error}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleAddChucVu}>
          <Text style={styles.buttonText}>Thêm Chức Vụ</Text>
        </TouchableOpacity>

      </View>
    </>
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
  errorContainer: {
    marginBottom: 10,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
});
