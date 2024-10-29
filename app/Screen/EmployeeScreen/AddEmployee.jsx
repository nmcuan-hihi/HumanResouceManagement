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
import { addEmployeeFireStore, getNewEmployeeId } from '../../services/EmployeeFireBase';
import { validateEmployeeData } from '../../utils/validate'; 

export default function AddMember({ navigation }) {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState({
    cccd: '',
    employeeId: employeeId,
    name: '',
    diachi: '',
    sdt: '',
    gioitinh: 'Nam', // Giá trị mặc định
    phongbanId: '', 
    chucvuId: '', 
    luongcoban: '',
    ngaysinh: '',
    ngaybatdau: '',
    matKhau: '',
    trangthai: 'true',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [phongBans, setPhongBans] = useState([]);
  const [chucVus, setChucVus] = useState([]);

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

    // Kiểm tra dữ liệu nhân viên
    const validationErrors = validateEmployeeData(employeeData);
    if (validationErrors.length > 0) {
      Alert.alert('Lỗi!', validationErrors.join('\n'));
      return;
    }

    try {
      openModal();
      await addEmployeeFireStore(employeeData, profileImage);
      Alert.alert('Thành công!', 'Nhân viên đã được thêm thành công.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi!', 'Có lỗi xảy ra khi thêm nhân viên.');
      console.error(error);
    } finally {
      closeModal();
    }
  };

  useEffect(() => {
    const fetchPhongBan = async () => {
      try {
        const data = await readPhongBan();
        if (data) {
          const phongBanArray = Object.values(data).map(p => ({
            label: p.tenPhongBan,
            value: p.maPhongBan,
          }));
          setPhongBans(phongBanArray);

          // Cập nhật phongbanId với giá trị đầu tiên nếu có ít nhất một phòng ban
          if (phongBanArray.length > 0) {
            updateField('phongbanId', phongBanArray[0].value);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy phòng ban:", error);
      }
    };

    const fetchChucVu = async () => {
      try {
        const data = await readChucVu();
        if (data) {
          const chucVuArr = Object.values(data).map(p => ({
            label: p.loaichucvu,
            value: p.chucvu_id,
          }));
          setChucVus(chucVuArr);

          // Cập nhật chucvuId với giá trị đầu tiên nếu có ít nhất một chức vụ
          if (chucVuArr.length > 0) {
            updateField('chucvuId', chucVuArr[0].value);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy chức vụ:", error);
      }
    };

    const fetchNewEmployeeId = async () => {
      try {
        const newId = await getNewEmployeeId();
        setEmployeeId(newId);
        updateField('employeeId', newId); // Cập nhật mã nhân viên mới
      } catch (error) {
        console.error("Error fetching new employee ID:", error);
      }
    };

    fetchNewEmployeeId();
    fetchPhongBan(); // Lấy phòng ban
    fetchChucVu(); // Lấy chức vụ
  }, []);

  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Add Member"}
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

            <Text style={styles.label}>Mã số CCCD</Text>
            <TextInput
              style={styles.input}
              value={employeeData.cccd}
              onChangeText={(value) => updateField('cccd', value)}
            />

            <Text style={styles.label}>Mã Nhân Viên</Text>
            <TextInput
              style={styles.input}
              value={employeeId}
              editable={false} // Để không cho phép chỉnh sửa mã nhân viên
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
              value={employeeData.gioitinh}
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

            <Text style={styles.label}>Lương cơ bản</Text>
            <TextInput
              style={styles.input}
              value={employeeData.luongcoban}
              onChangeText={(value) => updateField('luongcoban', value)}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput
              style={styles.input}
              value={employeeData.ngaysinh}
              onChangeText={(value) => updateField('ngaysinh', value)}
              placeholder="dd/mm/yyyy"
            />

            <Text style={styles.label}>Ngày bắt đầu</Text>
            <TextInput
              style={styles.input}
              value={employeeData.ngaybatdau}
              onChangeText={(value) => updateField('ngaybatdau', value)}
              placeholder="dd/mm/yyyy"
            />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={employeeData.matKhau}
              onChangeText={(value) => updateField('matKhau', value)}
              secureTextEntry
            />
          </ScrollView>
        </SafeAreaView>
        <ViewLoading />
      </KeyboardAvoidingView>
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
