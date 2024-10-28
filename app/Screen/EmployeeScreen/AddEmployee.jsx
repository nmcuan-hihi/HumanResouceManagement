import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BackNav from '../../Compoment/BackNav';
import RNPickerSelect from 'react-native-picker-select';
import { addEmployee, readChucVu, readPhongBan } from '../../services/database';
import ViewLoading, { openModal, closeModal } from '../../Compoment/ViewLoading';

export default function AddMember({ navigation }) {
  const [employeeData, setEmployeeData] = useState({
    cccd: '',
    employeeId: '',
    name: '',
    diachi: '',
    sdt: '',
    gioitinh: 'Nam', // Giá trị mặc định là "Nam"
    phongbanId: '',
    chucvuId: '',
    luongcoban: '',
    ngaysinh: '',
    ngaybatdau: '',
    matKhau: '',
  });

  const [profileImage, setProfileImage] = useState(null); // Ảnh đại diện
  const [phongBans, setPhongBans] = useState([]); // Danh sách phòng ban
  const [chucVus, setChucVus] = useState([]); // Danh sách chức vụ

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Từ chối quyền truy cập', 'Vui lòng cấp quyền để chọn ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Ảnh vuông
      quality: 1, // Ảnh chất lượng cao
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Lưu ảnh đã chọn
    }
  };

  // Hàm cập nhật từng trường trong state employeeData
  const updateField = (field, value) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  // Hàm kiểm tra tất cả các trường có đầy đủ không
  const isFormComplete = () => {
    return (
      employeeData.cccd &&
      employeeData.employeeId &&
      employeeData.name &&
      employeeData.diachi &&
      employeeData.sdt &&
      employeeData.gioitinh &&
      employeeData.phongbanId &&
      employeeData.chucvuId &&
      employeeData.luongcoban &&
      employeeData.ngaysinh &&
      employeeData.ngaybatdau &&
      profileImage
    );
  };

  // Hàm thêm nhân viên
  const handleAddEmployee = async () => {
    if (!isFormComplete()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đủ tất cả các trường.');
      return;
    }

    try {
      openModal();
      await addEmployee(employeeData, profileImage); // Thêm nhân viên vào DB
      Alert.alert('Thành công!', 'Đã thêm nhân viên thành công.');
      navigation.goBack(); // Quay lại màn hình trước
    } catch (error) {
      Alert.alert('Lỗi!', 'Có lỗi xảy ra khi thêm nhân viên.');
      console.error(error);
    } finally {
      closeModal(); // Đóng modal tải
    }
  };

  // useEffect để lấy dữ liệu phòng ban và chức vụ khi tải màn hình
  useEffect(() => {
    const fetchPhongBan = async () => {
      try {
        const data = await readPhongBan(); // Lấy dữ liệu phòng ban từ DB
        if (data) {
          const phongBanArray = Object.values(data).map(p => ({
            label: p.tenPhongBan,
            value: p.maPhongBan,
          }));
          setPhongBans(phongBanArray);
        }
      } catch (error) {
        console.error("Lỗi khi lấy phòng ban:", error);
      }
    };

    const fetchChucVu = async () => {
      try {
        const data = await readChucVu(); // Lấy dữ liệu chức vụ từ DB
        if (data) {
          const chucVuArr = Object.values(data).map(p => ({
            label: p.loaichucvu,
            value: p.chucvu_id,
          }));
          setChucVus(chucVuArr);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chức vụ:", error);
      }
    };

    fetchPhongBan();
    fetchChucVu();
  }, []);

  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Thêm nhân viên"}
        btn={"Lưu"}
        onEditPress={handleAddEmployee}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
      >
        <SafeAreaView>
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

            <Text style={styles.label}>Số CCCD</Text>
            <TextInput
              style={styles.input}
              value={employeeData.cccd}
              onChangeText={(value) => updateField('cccd', value)}
            />

            <Text style={styles.label}>Mã nhân viên</Text>
            <TextInput
              style={styles.input}
              value={employeeData.employeeId}
              onChangeText={(value) => updateField('employeeId', value)}
            />

            <Text style={styles.label}>Họ và tên</Text>
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

            <Text style={styles.label}>Lương cơ bản</Text>
            <TextInput
              style={styles.input}
              value={employeeData.luongcoban}
              onChangeText={(value) => updateField('luongcoban', value)}
              keyboardType="numeric"
            />

          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <ViewLoading/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 16,
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
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
  },
});

// Styles cho component picker select
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
  },
  inputAndroid: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
  },
});
