import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ChamCongNV() {
  const [timeIn, setTimeIn] = useState('9:30');
  const [timeOut, setTimeOut] = useState('17:00');
  const [selectedMonth, setSelectedMonth] = useState('December 2022');
  const [searchQuery, setSearchQuery] = useState('');

  const employees = [
    { id: 'NV001', name: 'Nguyễn Minh Quân', department: 'Phòng IT', status: 'checked' },
    { id: 'NV001', name: 'Nguyễn Minh Quân', department: 'Phòng IT', status: 'checked' },
    { id: 'NV001', name: 'Nguyễn Minh Quân', department: 'Phòng IT', status: 'checked' },
    { id: 'NV001', name: 'Nguyễn Minh Quân', department: 'Phòng IT', status: 'checked' },
    { id: 'NV001', name: 'Nguyễn Minh Quân', department: 'Phòng IT', status: 'unchecked' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chấm công</Text>
        <TouchableOpacity>
          <Text style={styles.saveButton}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.timeLabel}>Thời gian</Text>
        <View style={styles.timeInputs}>
          <View style={styles.timeInputContainer}>
            <Text>Vào</Text>
            <TextInput style={styles.timeInput} value={timeIn} onChangeText={setTimeIn} />
          </View>
          <View style={styles.timeInputContainer}>
            <Text>Ra</Text>
            <TextInput style={styles.timeInput} value={timeOut} onChangeText={setTimeOut} />
          </View>
        </View>
      </View>

      <View style={styles.calendarSection}>
        <TouchableOpacity style={styles.monthSelector}>
          <Text>{selectedMonth}</Text>
          <Icon name="arrow-drop-down" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.calendarNavigation}>
          <TouchableOpacity>
            <Icon name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Icon name="calendar-today" size={24} color="black" />
          <TouchableOpacity>
            <Icon name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterSection}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilterButton]}>
          <Text style={styles.filterButtonText}>Đi làm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Nghỉ có lương</Text>
          <Icon name="arrow-drop-down" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Phòng ban</Text>
          <Icon name="arrow-drop-down" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <Icon name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.employeeList}>
        {employees.map((employee, index) => (
          <View key={index} style={[
            styles.employeeItem,
            index % 2 === 0 ? styles.evenItem : styles.oddItem,
            employee.status === 'unchecked' && styles.uncheckedItem
          ]}>
            <View>
              <Text style={styles.employeeName}>{employee.id} {employee.name}</Text>
              <Text style={styles.employeeDepartment}>{employee.department}</Text>
            </View>
            <Icon name="check-circle" size={24} color={employee.status === 'checked' ? 'green' : 'gray'} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    color: 'blue',
    fontWeight: 'bold',
  },
  timeSection: {
    backgroundColor: '#FFD700',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  timeLabel: {
    marginBottom: 8,
  },
  timeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    backgroundColor: 'white',
    padding: 4,
    marginLeft: 8,
    width: 60,
    textAlign: 'center',
  },
  calendarSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 16,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    marginRight: 4,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
  },
  employeeList: {
    marginHorizontal: 16,
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  evenItem: {
    backgroundColor: '#E0FFFF',
  },
  oddItem: {
    backgroundColor: '#FFFACD',
  },
  uncheckedItem: {
    backgroundColor: '#D3D3D3',
  },
  employeeName: {
    fontWeight: 'bold',
  },
  employeeDepartment: {
    color: 'gray',
  },
});

