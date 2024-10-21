import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { readEmployees, updateEmployee, deleteEmployee, readPhongBan } from '../../services/database';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';

export default function EmployeeEditScreen({ navigation, route }) {
  const { manv } = route.params;
  const [employeeData, setEmployeeData] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState('');
  const [phongBans, setPhongBans] = useState([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const data = await readEmployees();
      const employee = data[manv];
      if (employee) {
        setEmployeeData(employee);
      }
    };

    const fetchPhongBan = async () => {
      const data = await readPhongBan();
      const phongBanArray = Object.values(data).map(p => ({
        label: p.tenPhongBan,
        value: p.maPhongBan,
      }));
      setPhongBans(phongBanArray);
    };

    fetchEmployeeData();
    fetchPhongBan();
  }, [manv]);

  const updateField = (field, value) => {
    setEmployeeData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || employeeData[dateField];
    setShowDatePicker(false);
    if (currentDate) {
      updateField(dateField, currentDate.toISOString().split('T')[0]);
    }
  };

  const showDatePickerModal = (field) => {
    setDateField(field);
    setShowDatePicker(true);
  };
  const [profileImage, setProfileImage] = useState(null);
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
      setProfileImage(result.assets[0].uri); // Lưu đường dẫn hình ảnh
      updateField('profileImage', result.assets[0].uri); // Cập nhật đường dẫn vào employeeData
    }
  };
  

  const handleUpdate = async () => {
    try {
      // Cập nhật hình ảnh vào employeeData
      if (profileImage) {
        employeeData.profileImage = profileImage;
      }
  
      await updateEmployee(manv, employeeData);
      Alert.alert("Thông báo", "Cập nhật thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error updating employee:", error);
      Alert.alert("Thông báo", "Cập nhật không thành công!");
    }
  };
  

  const handleDelete = async () => {
    try {
      await deleteEmployee(manv);
      Alert.alert("Thông báo", "Xóa thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error deleting employee:", error);
      Alert.alert("Thông báo", "Xóa không thành công!");
    }
  };

  if (!employeeData) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
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

        <InputField label="Chọn phòng ban" value={employeeData.phongbanId} onChangeText={(value) => updateField('phongbanId', value)} isDropdown items={phongBans} />
        <InputField label="Chức vụ" value={employeeData.chucvuId} onChangeText={(value) => updateField('chucvuId', value)} isDropdown items={[
          { label: 'Trưởng Phòng', value: 'TP' },
          { label: 'Nhân viên', value: 'NV' },
          { label: 'Thực tập sinh', value: 'TTS' },
          { label: 'Phó Phòng', value: 'PP' },
        ]} />
        <InputField label="Mã Nhân Viên" value={employeeData.employeeId} onChangeText={(value) => updateField('employeeId', value)} />
        <InputField label="Họ Tên" value={employeeData.name} onChangeText={(value) => updateField('name', value)} />

        <TouchableOpacity onPress={() => showDatePickerModal('ngaysinh')} style={styles.datePicker}>
          <Text style={styles.label}>Ngày sinh</Text>
          <Text>{employeeData.ngaysinh || "Chọn ngày"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => showDatePickerModal('ngaybatdau')} style={styles.datePicker}>
          <Text style={styles.label}>Ngày vào</Text>
          <Text>{employeeData.ngaybatdau || "Chọn ngày"}</Text>
        </TouchableOpacity>

        <InputField label="Số điện thoại" value={employeeData.sdt} onChangeText={(value) => updateField('sdt', value)} keyboardType="phone-pad" />
        <InputField label="Lương cơ bản" value={employeeData.luongcoban} onChangeText={(value) => updateField('luongcoban', value)} keyboardType="numeric" />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.updateButtonText}>Cập Nhật</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(employeeData[dateField])}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const InputField = ({ label, value, onChangeText, isDropdown, items }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    {isDropdown ? (
      <RNPickerSelect
        onValueChange={onChangeText}
        value={value}
        items={items}
        style={pickerSelectStyles}
      />
    ) : (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Nhập ${label}`}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    margin: 10,
  },
  scrollView: {
    padding: 10,
    paddingBottom: 20,
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
  imagePickerButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  imagePickerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: 'white',
  },
  datePicker: {
    marginVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'white',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
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
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
    marginTop: 5,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black',
    marginTop: 5,
  },
});
