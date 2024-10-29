import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BackNav from '../../Compoment/BackNav';
import ViewLoading, { openModal, closeModal } from '../../Compoment/ViewLoading';
import { editEmployeeFireStore, getEmployeeById } from '../../services/EmployeeFireBase';
import { readChucVu, readPhongBan } from '../../services/database';

export default function EditMember({ route, navigation }) {
  const { manv } = route.params || {}; 

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
    trangthai: 'true',
    imageUrl: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [phongBans, setPhongBans] = useState([]);
  const [chucVus, setChucVus] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employee = await getEmployeeById(manv);
        setEmployeeData({
          cccd: employee?.cccd || '',
          employeeId: employee?.employeeId || '',
          name: employee?.name || '',
          diachi: employee?.diachi || '',
          sdt: employee?.sdt || '',
          gioitinh: employee?.gioitinh || 'Nam',
          phongbanId: employee?.phongbanId || '',
          chucvuId: employee?.chucvuId || '',
          luongcoban: employee?.luongcoban || '',
          ngaysinh: employee?.ngaysinh || '',
          ngaybatdau: employee?.ngaybatdau || '',
          matKhau: employee?.matKhau || '',
          trangthai: employee?.trangthai || 'true',
          imageUrl: employee?.imageUrl || '',
        });
        setProfileImage(employee?.imageUrl || null);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin nhân viên:', error);
      }
    };

    fetchEmployeeData();
  }, [manv]);

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

    if (!result.canceled && result.assets?.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const updateField = (field, value) => {
    setEmployeeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditEmployee = async () => {
    try {
      openModal();
      const imageToUpload = profileImage !== employeeData.imageUrl ? profileImage : null;

      await editEmployeeFireStore(employeeData, imageToUpload);
      Alert.alert('Thành công!', 'Thông tin nhân viên đã được cập nhật.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi!', 'Có lỗi xảy ra khi cập nhật thông tin.');
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
          const phongBanArray = Object.values(data).map((p) => ({
            label: p.tenPhongBan,
            value: p.maPhongBan,
          }));
          setPhongBans(phongBanArray);
        }
      } catch (error) {
        console.error('Lỗi khi lấy phòng ban:', error);
      }
    };

    const fetchChucVu = async () => {
      try {
        const data = await readChucVu();
        if (data) {
          const chucVuArr = Object.values(data).map((p) => ({
            label: p.loaichucvu,
            value: p.chucvu_id,
          }));
          setChucVus(chucVuArr);
        }
      } catch (error) {
        console.error('Lỗi khi lấy chức vụ:', error);
      }
    };

    fetchPhongBan();
    fetchChucVu();
  }, []);

  const toggleTrangThai = () => {
    const currentStatus = employeeData.trangthai === 'true';
    const newStatus = !currentStatus;
    const message = newStatus
      ? 'Bạn có muốn bật hoạt động không?'
      : 'Bạn có muốn tắt hoạt động không?';

    Alert.alert('Xác nhận', message, [
      { text: 'Không', style: 'cancel' },
      {
        text: 'Có',
        onPress: () => updateField('trangthai', newStatus ? 'true' : 'false'),
      },
    ]);
  };

  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Edit Member"}
        btn={"Lưu"}
        onEditPress={handleEditEmployee}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView>
          <ScrollView style={{ paddingHorizontal: 15 }}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage}>
                <Image
                  source={
                    profileImage
                      ? { uri: profileImage }
                      : require('../../../assets/image/images.png')
                  }
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              value={employeeData.name}
              onChangeText={(text) => updateField('name', text)}
              style={styles.input}
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              value={employeeData.sdt}
              onChangeText={(text) => updateField('sdt', text)}
              style={styles.input}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              value={employeeData.diachi}
              onChangeText={(text) => updateField('diachi', text)}
              style={styles.input}
            />

            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput
              value={employeeData.ngaysinh}
              onChangeText={(text) => updateField('ngaysinh', text)}
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Ngày bắt đầu</Text>
            <TextInput
              value={employeeData.ngaybatdau}
              onChangeText={(text) => updateField('ngaybatdau', text)}
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>Chức vụ</Text>
            <TextInput
              value={employeeData.chucvuId}
              onChangeText={(text) => updateField('chucvuId', text)}
              style={styles.input}
            />

            <Text style={styles.label}>Phòng ban</Text>
            <TextInput
              value={employeeData.phongbanId}
              onChangeText={(text) => updateField('phongbanId', text)}
              style={styles.input}
            />

            <Text style={styles.label}>Trạng thái</Text>
            <TouchableOpacity style={styles.statusContainer} onPress={toggleTrangThai}>
              <Text style={styles.statusText}>
                {employeeData.trangthai === 'true' ? 'Đang hoạt động' : 'Không hoạt động'}
              </Text>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: employeeData.trangthai === 'true' ? 'green' : 'red' },
                ]}
              />
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <ViewLoading />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 15,
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10, // Khoảng cách từ trên xuống
    right: 15, // Khoảng cách từ bên phải
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  datePicker: {
    marginBottom: 20,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "flex-start",
  },
  updateButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF5733",
    padding: 15,
    marginBottom: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    marginBottom: 5,
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  

  statusContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  statusText: { fontSize: 16, marginRight: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  closeButton: {
    position: 'absolute',
    top: 10, // Khoảng cách từ trên xuống
    right: 15, // Khoảng cách từ bên phải
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 20,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    color: "black",
    marginBottom: 20,
  },
});

