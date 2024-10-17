import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import BackNav from '../../Compoment/BackNav';

export default function AddMember({navigation}) {
   
  const [employeeData, setEmployeeData] = useState({
    room: '',
    position: '',
    password: '',
    employeeId: '',
    name: '',
    address: '',
    birthDate: '',
    phone: '',
    salary: '',
    joinDate: '',
  });

  const updateField = (field, value) => {
    setEmployeeData(prev => ({ ...prev, [field]: value }));
  };

  return (
      <><BackNav 
      navigation={navigation} 
      name={"Add Member"} 
      btn={"Lưu"} 
      onEditPress={() => navigation.goBack()} // Sửa chỗ này
    />
      <SafeAreaView style={styles.container}>

          <ScrollView>
              <View style={styles.avatarContainer}>
                  <Image
                      source={require("../../../assets/image/images.png")}
                      style={styles.avatar} />
              </View>

              <InputField label="Chọn phòng" value={employeeData.room} onChangeText={(value) => updateField('room', value)} isDropdown />
              <InputField label="Chức vụ" value={employeeData.position} onChangeText={(value) => updateField('position', value)} isDropdown />
              <InputField label="Mật Khẩu" value={employeeData.password} onChangeText={(value) => updateField('password', value)} secureTextEntry />
              <InputField label="Mã Nhân Viên" value={employeeData.employeeId} onChangeText={(value) => updateField('employeeId', value)} />
              <InputField label="Họ Tên" value={employeeData.name} onChangeText={(value) => updateField('name', value)} />
              <InputField label="Địa chỉ" value={employeeData.address} onChangeText={(value) => updateField('address', value)} />
              <InputField label="Ngày sinh" value={employeeData.birthDate} onChangeText={(value) => updateField('birthDate', value)} />
              <InputField label="Số điện thoại" value={employeeData.phone} onChangeText={(value) => updateField('phone', value)} keyboardType="phone-pad" />
              <InputField label="Lương cơ bản" value={employeeData.salary} onChangeText={(value) => updateField('salary', value)} keyboardType="numeric" />
              <InputField label="Ngày vào" value={employeeData.joinDate} onChangeText={(value) => updateField('joinDate', value)} />

          </ScrollView>
      </SafeAreaView></>
  );
};

const InputField = ({ label, value, onChangeText, isDropdown, secureTextEntry, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, isDropdown && styles.dropdownWrapper]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      {isDropdown && <Text style={styles.dropdownIcon}>▼</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 9,
    backgroundColor: '#fff',
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  dropdownWrapper: {
    justifyContent: 'space-between',
  },
  dropdownIcon: {
    paddingRight: 10,
    color: '#999',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

