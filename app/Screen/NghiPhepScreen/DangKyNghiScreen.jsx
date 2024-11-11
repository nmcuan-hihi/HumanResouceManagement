import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { CheckBox } from '@rneui/themed';
import BackNav from '../../Compoment/BackNav';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dangKyNghiPhep } from '../../services/NghiPhepDB';

export default function DangKyNghiScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState({ start: false, end: false });
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');

  // Hàm xử lý hiển thị DatePicker
  const handleDatePickerVisibility = (type) => {
    setShowDatePicker({
      start: type === 'start',
      end: type === 'end',
    });
  };

  // Hàm thay đổi ngày
  const handleDateChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || (type === 'start' ? selectedStartDate : selectedEndDate);
    setShowDatePicker({ start: false, end: false });
    
    if (type === 'start') {
      setSelectedStartDate(currentDate);
    } else {
      setSelectedEndDate(currentDate);
    }
  };

  // Hàm gửi đơn nghỉ phép
  const handleSubmit = async () => {
    if (!title || !reason) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ tiêu đề và lý do");
      return;
    }

    const nghiPhepData = {
      employeeId: "12345", // Thay thế ID của nhân viên thực tế
      startDate: "11/12/2222",
      endDate: "11/12/2222",
      title: title,
      reason: reason,
      type: selectedIndex === 0 ? "Có lương" : "Không lương",
      status: "Chưa duyệt",
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
      {/* Header */}
      <View style={styles.header}>
        <BackNav btn={"Gửi"} name={"Đăng Ký Nghỉ Phép"} onEditPress={handleSubmit} />
      </View>

      {/* Date Selection */}
      <View style={styles.dateContainer}>
        <View style={styles.timeInputs}>
          <Text style={styles.timeLabel}>Từ ngày</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => handleDatePickerVisibility('start')}
          >
            <Text>{selectedStartDate.toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            <Icon name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.timeInputs}>
          <Text style={styles.timeLabel}>Đến ngày</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => handleDatePickerVisibility('end')}
          >
            <Text>{selectedEndDate.toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            <Icon name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* CheckBox Options */}
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

      {/* Title and Reason Fields */}
      <Text>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề"
        value={title}
        onChangeText={setTitle}
      />
      <Text>Lý Do</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Nhập lý do"
        multiline
        value={reason}
        onChangeText={setReason}
      />

      {/* Date Pickers */}
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
