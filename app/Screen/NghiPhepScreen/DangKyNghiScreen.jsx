import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { CheckBox } from '@rneui/themed';
import BackNav from '../../Compoment/BackNav';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dangKyNghiPhep } from '../../services/NghiPhepDB';
import firebase from 'firebase/app';
import 'firebase/database'; // Or use Firestore if necessary
import { getPhongBanById } from '../../services/InfoDataLogin';

export default function DangKyNghiScreen({ route, navigation }) {
  const { employee } = route.params; // Get employee info from route.params
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState({ start: false, end: false });
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');
  const [phongBan, setPhongBan] = useState('');

  useEffect(() => {
    const fetchPhongBan = async () => {
      try {
        // Giả sử bạn có một hàm `getPhongBanById` lấy thông tin phòng ban
        const tenPhongBan = await getPhongBanById(employee.phongbanId);
        console.log("--------" + tenPhongBan.tenPhongBan)
        setPhongBan(tenPhongBan.tenPhongBan);
      } catch (error) {
        console.error("Lỗi khi lấy phòng ban:", error);
      }
    };
  
    if (employee && employee.phongbanId) {
      fetchPhongBan(); // Gọi hàm lấy tên phòng ban khi có ID phòng ban
    }
  }, [employee]); // Cập nhật lại khi `employee` thay đổi

  const handleDatePickerVisibility = (type) => {
    setShowDatePicker({
      start: type === 'start',
      end: type === 'end',
    });
  };

  const handleDateChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || (type === 'start' ? selectedStartDate : selectedEndDate);
    setShowDatePicker({ start: false, end: false });
    
    if (type === 'start') {
      setSelectedStartDate(currentDate);
    } else {
      setSelectedEndDate(currentDate);
    }
  };

  const handleSubmit = async () => {
    if (!title || !reason) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ tiêu đề và lý do");
      return;
    }

   

    const nghiPhepData = {
      employeeId: employee.employeeId,
      employeeName: employee.name, // Add employee name
      department: phongBan, // Add department info
      startDate: selectedStartDate.toLocaleDateString(),
      endDate: selectedEndDate.toLocaleDateString(),
      title: title,
      reason: reason,
      type: selectedIndex === 0 ? "Có lương" : "Không lương",
      status: "0",
    };

    try {
      await dangKyNghiPhep(nghiPhepData);
      Alert.alert("Thành công", "Đơn nghỉ phép đã được gửi");
    } catch (error) {
      Alert.alert("Lỗi", "Gửi đơn nghỉ phép thất bại");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackNav btn={"Gửi"} name={"Đăng Ký Nghỉ Phép"} onEditPress={handleSubmit} />
      </View>

      <View style={styles.dateContainer}>
        <View style={styles.timeInputs}>
          <Text style={styles.timeLabel}>Từ ngày</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={() => handleDatePickerVisibility('start')}>
            <Text>{selectedStartDate.toLocaleDateString()}</Text>
            <Icon name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.timeInputs}>
          <Text style={styles.timeLabel}>Đến ngày</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={() => handleDatePickerVisibility('end')}>
            <Text>{selectedEndDate.toLocaleDateString()}</Text>
            <Icon name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.checkboxContainer}>
        <CheckBox
          checked={selectedIndex === 0}
          onPress={() => setSelectedIndex(0)}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          title="Nghỉ có lương"
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxText}
        />
        <CheckBox
          checked={selectedIndex === 1}
          onPress={() => setSelectedIndex(1)}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          title="Không lương"
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxText}
        />
      </View>

      <Text>Tiêu đề</Text>
      <TextInput style={styles.input} placeholder="Nhập tiêu đề" value={title} onChangeText={setTitle} />
      <Text>Lý Do</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Nhập lý do"
        multiline
        value={reason}
        onChangeText={setReason}
      />

      {showDatePicker.start && (
        <DateTimePicker
          value={selectedStartDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, 'start')}
        />
      )}
      {showDatePicker.end && (
        <DateTimePicker
          value={selectedEndDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, 'end')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  dateContainer: { marginVertical: 10 },
  timeLabel: { marginBottom: 8 },
  timeInputs: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 },
  dateSelector: { flexDirection: 'row', alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 10, marginTop: 5 },
  textArea: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginTop: 5, height: 100, textAlignVertical: 'top', marginBottom: 10 },
  checkboxContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10 },
  checkbox: { backgroundColor: 'transparent', borderWidth: 0, padding: 0 },
  checkboxText: { fontSize: 14, color: '#333' },
});
