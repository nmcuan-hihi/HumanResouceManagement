import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Image, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BackNav from '../../Compoment/BackNav';
import RNPickerSelect from 'react-native-picker-select';
import { addEmployee, readPhongBan, readChucVu } from '../../services/database'; // Import hàm thêm nhân viên và đọc phòng ban

export default function AddMember({ navigation }) {
  const [employeeData, setEmployeeData] = useState({
    cccd: '',
    employeeId: '',
    name: '',
    diachi: '',
    sdt: '',
    gioitinh: 'Nam',
    phongbanId: '',
    chucvuId: '',
    luongcoban: '',
    ngaysinh: '',
    ngaybatdau: '',
    matKhau: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [phongBans, setPhongBans] = useState([]);
  const [chucVus, setchucVus] = useState([]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền bị từ chối!', 'Vui lòng cấp quyền để chọn ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const updateField = (field, value) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddEmployee = async () => {
    if (!profileImage) {
      Alert.alert('Chưa chọn hình ảnh!', 'Vui lòng chọn hình ảnh cho nhân viên.');
      return;
    }
    await addEmployee(employeeData, profileImage);
    navigation.goBack(); // Quay lại màn hình trước
  };

  useEffect(() => {
    const fetchPhongBan = async () => {
      const data = await readPhongBan();
      if (data) {
        const phongBanArray = Object.values(data).map(p => ({
          label: p.tenPhongBan,
          value: p.maPhongBan,
        }));
        setPhongBans(phongBanArray);
      }
    };
    const fetchChucVu = async () => {
      const data = await readChucVu();
      if (data) {
        const chucVuArr = Object.values(data).map(p => ({
          label: p.loaichucvu,
          value: p.chucvu_id,
        }));
        setchucVus(chucVuArr);
      }
    };

    fetchPhongBan();
    fetchChucVu();
  }, []);

  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Add Member"}
        btn={"Lưu"}
        onEditPress={handleAddEmployee} // Gọi hàm thêm nhân viên
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={profileImage
                  ? { uri: profileImage }
                  : require("../../../assets/image/images.png")}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Mã số CCCD</Text>
          <TextInput
            style={styles.input}
            value={employeeData.cccd}
            onChangeText={(value) => updateField('cccd', value)}
          />

          <Text style={styles.label}>Mã Nhân Viên</Text>
          <TextInput
            style={styles.input}
            value={employeeData.employeeId}
            onChangeText={(value) => updateField('employeeId', value)}
          />

          <Text style={styles.label}>Họ Tên</Text>
          <TextInput
            style={styles.input}
            value={employeeData.name}
            onChangeText={(value) => updateField('name', value)}
          />

          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            value={employeeData.diachi}
            onChangeText={(value) => updateField('diachi', value)}
          />

          <Text style={styles.label}>Số điện thoại</Text>
          <TextInput
            style={styles.input}
            value={employeeData.sdt}
            onChangeText={(value) => updateField('sdt', value)}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Giới tính</Text>
          <RNPickerSelect
            onValueChange={(value) => updateField('gioitinh', value)}
            items={[
              { label: 'Nam', value: 'Nam' },
              { label: 'Nữ', value: 'Nữ' },
              { label: 'Khác', value: 'Khác' },
            ]}
            style={pickerSelectStyles}
          />

          <Text style={styles.label}>Phòng ban</Text>
          <RNPickerSelect
            onValueChange={(value) => updateField('phongbanId', value)}
            value={employeeData.phongbanId}
            items={phongBans}
            style={pickerSelectStyles}
          />

          <Text style={styles.label}>Chức vụ</Text>
          <RNPickerSelect
            onValueChange={(value) => updateField('chucvuId', value)}
            value={employeeData.chucvuId}
            items={chucVus}
            style={pickerSelectStyles}
          />

          <Text style={styles.label}>Ngày sinh</Text>
          <TextInput
            style={styles.input}
            value={employeeData.ngaysinh}
            onChangeText={(value) => updateField('ngaysinh', value)}
          />

          <Text style={styles.label}>Ngày bắt đầu</Text>
          <TextInput
            style={styles.input}
            value={employeeData.ngaybatdau}
            onChangeText={(value) => updateField('ngaybatdau', value)}
          />
          <Text style={styles.label}>Mức lương cơ bản</Text>
          <TextInput
            style={styles.input}
            value={employeeData.luongcoban}
            onChangeText={(value) => updateField('luongcoban', value)}
            keyboardType="numeric"
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: '#fff',
    marginTop: -20,
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    color: "blue",
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
});

// Styles cho RNPickerSelect
const pickerSelectStyles = {
  inputIOS: {
    color: 'black',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
  },
  inputAndroid: {
    color: 'black',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
  },
};