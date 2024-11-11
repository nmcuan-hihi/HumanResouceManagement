import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { readEmployeesFireStore } from '../../services/EmployeeFireBase';

export default function ChamCongNV() {
  const [timeIn, setTimeIn] = useState(new Date());
  const [timeOut, setTimeOut] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState({ timeIn: false, timeOut: false, month: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const employeesData = await readEmployeesFireStore();
        if (employeesData) {
          setEmployees(employeesData);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    fetchEmployees();
  }, []);

  const handleTimeChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || (type === 'timeIn' ? timeIn : timeOut);
    setShowTimePicker(prev => ({ ...prev, [type]: Platform.OS === 'ios' && false })); // Close DateTimePicker after selection
    type === 'timeIn' ? setTimeIn(currentDate) : setTimeOut(currentDate);
  };

  const handleMonthChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedMonth;
    setShowTimePicker(prev => ({ ...prev, month: Platform.OS === 'ios' && false }));
    setSelectedMonth(currentDate);
  };
  const handleTimePickerVisibility = (type) => {
    setShowTimePicker({
      timeIn: type === 'timeIn',
      timeOut: type === 'timeOut',
      month: type === 'month',
    });
  };


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
        <View style={styles.timeInputs} >
          <Text style={styles.timeLabel}>Thời gian</Text>
          <TouchableOpacity style={styles.monthSelector} onPress={() => handleTimePickerVisibility('month')}>
            <Text>{selectedMonth.toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            <Icon name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>

        </View>
        <View style={styles.timeInputs}>
          <View style={styles.timeInputContainer}>
            <Text>Vào</Text>
            <TouchableOpacity onPress={() => handleTimePickerVisibility('timeIn')}>
              <Text style={styles.timeText}>{timeIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeInputContainer}>
            <Text>Ra</Text>
            <TouchableOpacity onPress={() => handleTimePickerVisibility('timeOut')}>
              <Text style={styles.timeText}>{timeOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
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
          <View
            key={index}
            style={[
              styles.employeeItem,
              index % 2 === 0 ? styles.evenItem : styles.oddItem,
              employee.trangthai === 'unchecked' && styles.uncheckedItem,
            ]}
          >
            <View>
              <Text style={styles.employeeName}>{employee.employeeId} {employee.name}</Text>
              <Text style={styles.employeeDepartment}>{employee.department}</Text>
            </View>
            <Icon name="check-circle" size={24} color={employee.trangthai === 'checked' ? 'green' : 'gray'} />
          </View>
        ))}
      </ScrollView>

      {/* Thay đổi phần DateTimePicker để sử dụng kiểu 'spinner' trên iOS */}
      {showTimePicker.timeIn && (
        <DateTimePicker
          value={timeIn}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleTimeChange(event, date, 'timeIn')}
        />
      )}

      {showTimePicker.timeOut && (
        <DateTimePicker
          value={timeOut}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleTimeChange(event, date, 'timeOut')}
        />
      )}

      {showTimePicker.month && (
        <DateTimePicker
          value={selectedMonth}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleMonthChange}
        />
      )}
    </SafeAreaView>
  );
}

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
  timeText: {
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
