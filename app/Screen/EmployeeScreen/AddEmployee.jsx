import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Thư viện chọn ảnh từ thiết bị
import BackNav from '../../Compoment/BackNav'; // Điều hướng quay lại
import RNPickerSelect from 'react-native-picker-select'; // Component chọn dữ liệu từ danh sách
import { addEmployee, readChucVu, readPhongBan } from '../../services/database'; // Hàm tương tác với DB
import ViewLoading, { openModal } from '../../Compoment/ViewLoading';

// Component chính để thêm nhân viên
export default function AddMember({ navigation }) {
  // State lưu thông tin nhân viên
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

  const [profileImage, setProfileImage] = useState(null); // Lưu ảnh đại diện
  const [phongBans, setPhongBans] = useState([]); // Danh sách phòng ban
  const [chucVus, setChucVus] = useState([]); // Danh sách chức vụ

  // Hàm chọn ảnh từ thư viện
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền bị từ chối!', 'Vui lòng cấp quyền để chọn ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Ảnh vuông
      quality: 1, // Chất lượng ảnh cao
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Lưu ảnh đã chọn
    }
  };

  // Hàm cập nhật giá trị từng trường trong state employeeData
  const updateField = (field, value) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  // Hàm thêm nhân viên
  const handleAddEmployee = async () => {
    if (!profileImage) {
      Alert.alert('Chưa chọn hình ảnh!', 'Vui lòng chọn hình ảnh cho nhân viên.');
      return;
    }

    try {
      openModal()
      await addEmployee(employeeData, profileImage); // Thêm nhân viên vào DB
      Alert.alert('Thành công!', 'Nhân viên đã được thêm thành công.');
      navigation.goBack(); // Quay lại màn hình trước
    } catch (error) {
      Alert.alert('Lỗi!', 'Có lỗi xảy ra khi thêm nhân viên.');
      console.error(error);
    }finally {
      closeModal(); // Đóng modal loading
    }
  };

  // useEffect để lấy dữ liệu phòng ban và chức vụ khi màn hình tải
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

    fetchPhongBan(); // Gọi hàm lấy phòng ban
    fetchChucVu(); // Gọi hàm lấy chức vụ
  }, []);

  // Giao diện người dùng
  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Add Member"}
        btn={"Lưu"}
        onEditPress={handleAddEmployee} // Gọi hàm thêm nhân viên
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
                    : require("../../../assets/image/images.png")} // Ảnh mặc định nếu chưa chọn
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
      </KeyboardAvoidingView>
      <ViewLoading/>
    </>
  );
}

// Các style cho giao diện
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
    backgroundColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

// Styles cho RNPickerSelect
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    marginBottom: 15,
  },
};
