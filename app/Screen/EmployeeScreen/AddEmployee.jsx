import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView,TouchableOpacity,Text ,Alert} from 'react-native';
import { writeEmployeeData } from '../../services/database';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackNav from '../../Compoment/BackNav';

export default function AddEmployeeScreen({navigation}) {

  const [showDatePicker, setShowDatePicker] = useState(false); // Để điều khiển hiển thị DatePicker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày được chọn
  const [dateField, setDateField] = useState(''); // Trường ngày hiện đang chỉnh sửa

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false); // Ẩn DatePicker sau khi chọn ngày
    setSelectedDate(currentDate);

    const formattedDate = currentDate.toLocaleDateString('en-GB'); // Định dạng ngày (dd/mm/yyyy)
    handleInputChange(dateField, formattedDate); // Cập nhật trường ngày trong employeeData
  };

  const showDatePickerForField = (field) => {
    setDateField(field);
    setShowDatePicker(true); // Hiển thị DatePicker
  };

  const [employeeData, setEmployeeData] = useState({
    employee_id: '',
    name: '',
    cccd: '',
    chucvu_id: '',
    luongcoban_id: '',
    ngaybatdau: '',
    ngaysinh: '',
    phongban_id: '',
    sdt: '',
    trangthai: true, // Mặc định trạng thái là true
  });

  const handleInputChange = (field, value) => {
    setEmployeeData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    writeEmployeeData(employeeData);
    Alert.alert('Thông báo', 'Thêm nhân viên thành công!');
    navigation.navigate('ListEmployee',  { refresh: true });
    console.log("Employee added:", employeeData);
  };

  return (

    <><BackNav name={"Thêm nhân viên"} navigation={navigation} /><ScrollView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Mã Nhân Viên"
          value={employeeData.employeeId}
          onChangeText={(value) => handleInputChange('employeeId', value)} />
        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={employeeData.name}
          onChangeText={(value) => handleInputChange('name', value)} />
        <TextInput
          style={styles.input}
          placeholder="CCCD"
          value={employeeData.cccd}
          onChangeText={(value) => handleInputChange('cccd', value)} />
        <TextInput
          style={styles.input}
          placeholder="Chức vụ ID"
          value={employeeData.chucvu_id}
          onChangeText={(value) => handleInputChange('chucvu_id', value)} />
        <TextInput
          style={styles.input}
          placeholder="Lương cơ bản ID"
          value={employeeData.luongcoban_id}
          onChangeText={(value) => handleInputChange('luongcoban_id', value)} />
        {/* Ngày bắt đầu */}
        <TouchableOpacity onPress={() => showDatePickerForField('ngaybatdau')}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerText}>
              {employeeData.ngaybatdau ? employeeData.ngaybatdau : 'Chọn ngày bắt đầu'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Ngày sinh */}
        <TouchableOpacity onPress={() => showDatePickerForField('ngaysinh')}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerText}>
              {employeeData.ngaysinh ? employeeData.ngaysinh : 'Chọn ngày sinh'}
            </Text>
          </View>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Phòng ban ID"
          value={employeeData.phongban_id}
          onChangeText={(value) => handleInputChange('phongban_id', value)} />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={employeeData.sdt}
          onChangeText={(value) => handleInputChange('sdt', value)} />
        <Button title="Thêm Nhân Viên" onPress={handleSubmit} />
        {/* DatePicker component */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange} />
        )}
      </View>
    </ScrollView></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2F2F7',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  datePickerContainer: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  datePickerText: {
    color: '#333',
  },
});