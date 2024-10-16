import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'; // Assuming you're using this library for the picker
import { FontAwesome } from '@expo/vector-icons'; // If using Expo, import FontAwesome
import Dashboard from '../../Compoment/Dashboard';

export default function ChamCongNV() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  // Dữ liệu nhân viên
  const employees = [
    { id: 'NV001', name: 'Nguyễn Minh Quân', department: 'Phòng IT', status: 'Đi làm' },
    { id: 'NV002', name: 'Nguyễn Văn A', department: 'Phòng HR', status: 'Nghỉ có lương' },
    { id: 'NV003', name: 'Nguyễn Văn B', department: 'Phòng IT', status: 'Đi làm' },
    { id: 'NV004', name: 'Nguyễn Thị C', department: 'Phòng Kinh Doanh', status: 'Nghỉ có lương' },
    { id: 'NV005', name: 'Nguyễn Văn D', department: 'Phòng Marketing', status: 'Đi làm' },
    // Add more employees here
  ];

  // Xử lý thời gian vào
  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShowStartPicker(false);
    setStartTime(currentDate);
  };

  // Xử lý thời gian ra
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endTime;
    setShowEndPicker(false);
    setEndTime(currentDate);
  };

  // Lọc danh sách nhân viên theo tên
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chấm công</Text>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>Thời gian</Text>
        <View style={styles.timeInputs}>
          <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.timeInput}>
            <Text>{`Vào: ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.timeInput}>
            <Text>{`Ra: ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeStart}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeEnd}
          />
        )}
      </View>

      {/* Date Section */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>December 2022</Text>
        <FontAwesome name="calendar" size={24} color="black" />
        <View style={styles.dateNavigation}>
          <FontAwesome name="chevron-left" size={20} color="purple" />
          <FontAwesome name="chevron-right" size={20} color="purple" />
        </View>
      </View>

        {/* Tùy chọn lọc */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Đi làm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Nghỉ có lương</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Phòng ban</Text>
          </TouchableOpacity>
        </View>

        {/* Tìm kiếm theo tên */}
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* Danh sách nhân viên */}
        <ScrollView>
          {filteredEmployees.map(employee => (
            <View key={employee.id} style={styles.employeeItem}>
              <Text style={styles.employeeId}>{employee.id}</Text>
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeeDepartment}>{employee.department}</Text>
              <TouchableOpacity onPress={toggleCheck} style={styles.checkbox}>
        {isChecked ? (
          <View style={styles.checkedSquare}>
            <FontAwesome name="check" size={18} color="white" />
          </View>
        ) : (
          <View style={styles.uncheckedSquare} />
        )}
      </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    padding: 5,
  },
  checkedSquare: {
    width: 24,
    height: 24,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedSquare: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4C8FFF',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
  },
  timeContainer: {
    marginBottom: 20,
    backgroundColor: '#FFEAD1',
    padding: 10,
    borderRadius: 5,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
  },
  monthText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#FEDD71',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  filterButtonText: {
    color: '#333',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  employeeId: {
    fontWeight: 'bold',
  },
  employeeName: {
    flex: 1,
    marginLeft: 10,
  },
  employeeDepartment: {
    color: '#666',
  },
});
