import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BackNav from '../../Compoment/BackNav';
import RNPickerSelect from 'react-native-picker-select';
import { addEmployee, readChucVu, readPhongBan } from '../../services/database';
import ViewLoading, { openModal, closeModal } from '../../Compoment/ViewLoading';
import { addEmployeeFireStore, getNewEmployeeId } from '../../services/EmployeeFireBase';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function AddMember({ navigation }) {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeData, setEmployeeData] = useState({
    cccd: '',
    employeeId: employeeId,
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
  });

  const [profileImage, setProfileImage] = useState(null);
  const [phongBans, setPhongBans] = useState([]);
  const [chucVus, setChucVus] = useState([]);
  
  // State cho chọn ngày
  const [visibleCalendar, setVisibleCalendar] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState('ngaysinh'); // Trường đang chọn

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
        updateField('employeeId', newId);
      } catch (error) {
        console.error("Error fetching new employee ID:", error);
      }
    };

    fetchNewEmployeeId();
    fetchPhongBan();
    fetchChucVu();
  }, []);

  // Hàm xử lý chọn ngày
  const handleDayPress = (day) => {
    updateField(selectedDateField, day.dateString);
    setVisibleCalendar(false);
  };

  return (
    <>
      <BackNav
        navigation={navigation}
        name={"Thêm Nhân Viên"}
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

            <Text style={styles.label}>Họ và Tên</Text>
            <TextInput
              style={styles.input}
              value={employeeData.name}
              onChangeText={(text) => updateField('name', text)}
            />

            <Text style={styles.label}>CCCD</Text>
            <TextInput
              style={styles.input}
              value={employeeData.cccd}
              onChangeText={(text) => updateField('cccd', text)}
            />

            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={styles.input}
              value={employeeData.diachi}
              onChangeText={(text) => updateField('diachi', text)}
            />

            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={employeeData.sdt}
              onChangeText={(text) => updateField('sdt', text)}
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
              value={employeeData.gioitinh}
            />

            <Text style={styles.label}>Phòng ban</Text>
            <RNPickerSelect
              onValueChange={(value) => updateField('phongbanId', value)}
              items={phongBans}
              style={pickerSelectStyles}
              value={employeeData.phongbanId}
            />

            <Text style={styles.label}>Chức vụ</Text>
            <RNPickerSelect
              onValueChange={(value) => updateField('chucvuId', value)}
              items={chucVus}
              style={pickerSelectStyles}
              value={employeeData.chucvuId}
            />

            <Text style={styles.label}>Lương cơ bản</Text>
            <TextInput
              style={styles.input}
              value={employeeData.luongcoban}
              onChangeText={(text) => updateField('luongcoban', text)}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Ngày sinh</Text>
            <TextInput
              style={styles.input}
              value={employeeData.ngaysinh}
              editable={false}
              onTouchEnd={() => {
                setSelectedDateField('ngaysinh');
                setVisibleCalendar(true);
              }}
            />

            <Text style={styles.label}>Ngày bắt đầu</Text>
            <TextInput
              style={styles.input}
              value={employeeData.ngaybatdau}
              editable={false}
              onTouchEnd={() => {
                setSelectedDateField('ngaybatdau');
                setVisibleCalendar(true);
              }}
            />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              value={employeeData.matKhau}
              onChangeText={(text) => updateField('matKhau', text)}
              secureTextEntry
            />

            {/* Modal chọn ngày */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={visibleCalendar}
            >
              <View style={styles.modal}>
                <View style={styles.modalContent}>
                  <TouchableOpacity 
                    style={styles.closeButton} 
                    onPress={() => setVisibleCalendar(false)}
                  >
                    <Text style={styles.closeText}>X</Text>
                  </TouchableOpacity>
                  <Calendar
                    onDayPress={handleDayPress}
                    markedDates={{
                      [employeeData[selectedDateField]]: { selected: true },
                    }}
                  />
                </View>
              </View>
            </Modal>
          </ScrollView>
        </SafeAreaView>
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
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
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
