import React, { useState, useEffect } from 'react';
import {TextInput, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform , Modal,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { readPhongBanFromRealtime } from '../../services/PhongBanDatabase';
import { addChiTietChamCongToRealtime } from '../../services/chamcong';  // Import your Firestore function for adding attendance
import BackNav from '../../Compoment/BackNav';
import { searchEmployeesByNameOrId } from '../../services/PhongBanDatabase';
import { getEmployeesWithLeave } from '../../services/chamcong';
import { getEmployeesByLeaveType , getFilteredEmployeesByPhongBanAndLeave} from '../../services/chamcong';
export default function ChamCongNV({navigation, route}) {
  const { phongbanId } = route.params || {}; // Nhận dữ liệu từ params
  console.log(phongbanId);
  
  const [timeIn, setTimeIn] = useState(() => {
    const defaultTimeIn = new Date();
    defaultTimeIn.setHours(9, 0, 0, 0); // Đặt giờ là 9:00 sáng
    return defaultTimeIn;
  });
  const [timeOut, setTimeOut] = useState(() => {
    const defaultTimeIn = new Date();
    defaultTimeIn.setHours(17, 0, 0, 0); // Đặt giờ là 9:00 sáng
    return defaultTimeIn;
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState({ timeIn: false, timeOut: false, month: false });
  const [employees, setEmployees] = useState([]);
  const [openPhongBan, setOpenPhongBan] = useState(false);
  const [valuePhongBan, setValuePhongBan] = useState(null);
  const [phongBan, setPhongBan] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading modal
  const [openStatus, setOpenStatus] = useState(false);
  const [valueStatus, setValueStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  useEffect(() => {
   
    async function fetchEmployees() {
      try {
        const formattedDate = new Date(selectedMonth).toLocaleDateString('vi-VN');
        const employeesData = await getFilteredEmployeesByPhongBanAndLeave(phongbanId,formattedDate);
        if (employeesData) {
          setEmployees(employeesData);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
  
    async function fetchPhongBan() {
      try {
        const phongBanData = await readPhongBanFromRealtime();
        if (phongBanData) {
          const filteredPhongBan = phongBanData.filter(pban => pban.maPhongBan === phongbanId);
          setPhongBan(filteredPhongBan); // Chỉ lưu phòng ban khớp với phongbanId
        }
      } catch (error) {
        console.error("Error fetching phong ban:", error);
      }
    }
    
  
    fetchEmployees();
    fetchPhongBan();
  }, [selectedMonth,phongbanId]); // Thêm selectedMonth vào dependency
  

  useEffect(() => {
    if (phongbanId) {
      handleFilterEmployeesByPhongBan(phongbanId, selectedMonth);
    }
    
  }, [phongbanId]);
  useEffect(() => {
    
    if (valueStatus) {
      handleFilterEmployeesByStatus(valueStatus);
    }
  }, [valueStatus]);
  useEffect(() => {
    if (employees && employees.phongbanId !== phongbanId) {
      setIsButtonDisabled(true); // Vô hiệu hóa nút nếu không thuộc phòng ban
    } else {
      setIsButtonDisabled(false); // Bật nút nếu đúng phòng ban
    }
  }, [employees, phongbanId]);
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setFilteredData(employeeData);
    } else {
      const searchResults = await searchEmployeesByNameOrId(searchTerm);
      const employeeArray = Object.keys(searchResults).map((key) => ({
        ...searchResults[key],
        manv: key,
      }));
      setEmployees(employeeArray);
    }
  };
  const handleFilterEmployeesByPhongBan = async (phongbanId, selecl) => {
    try {
      const filteredEmployees = await getFilteredEmployeesByPhongBanAndLeave(phongbanId, selecl);
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error filtering employees by phòng ban:", error);
    }
  };
  const handleFilterEmployeesByStatus = async (phongbanId) => {
    try {
      const filteredEmployees = await getEmployeesByLeaveType(phongbanId);
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error filtering employees by phòng ban:", error);
    }
  };


  const handleTimeChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || (type === 'timeIn' ? timeIn : timeOut);
    setShowTimePicker(prev => ({ ...prev, [type]: Platform.OS === 'ios' && false }));
    type === 'timeIn' ? setTimeIn(currentDate) : setTimeOut(currentDate);
  };
   // Kiểm tra xem nhân viên có thuộc phongbanId này không
  const isEmployeeInPhongBan = (employeePhongBanId) => {
    return employeePhongBanId === phongbanId;
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

  const toggleCheckmark = (employeeId) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(employee =>
        employee.employeeId === employeeId
          ? { ...employee, trangthai: employee.trangthai === 'checked' ? 'unchecked' : 'checked' }
          : employee
      )
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setEmployees(prevEmployees =>
      prevEmployees.map(employee => ({
        ...employee,
        trangthai: !selectAll ? 'checked' : 'unchecked',
      }))
    );
  };

  const items = [
    { label: 'Nghỉ có lương', value: 'Có lương' },
    { label: 'Nghỉ không luong', value: 'Không lương' },
  ];

  const phongBanItems = phongBan.map(pban => ({
    label: pban.tenPhongBan,
    value: pban.maPhongBan,
  }));

  const handleSaveAttendance = async () => {
    setLoading(true);  // Show loading modal
    try {
      const selectedEmployees = employees.filter(employee => employee.trangthai === 'checked');
      if (selectedEmployees.length === 0) {
        alert('Vui lòng chọn ít nhất một nhân viên để chấm công');
        setLoading(false); // Hide loading modal
        return;
      }

      const attendanceData = selectedEmployees.map(employee => ({
        employeeId: employee.employeeId,
        timeIn,
        timeOut,
        status: "di_lam",
        month: selectedMonth,
      }));

      for (const data of attendanceData) {
        await addChiTietChamCongToRealtime(data);
      }
      alert('Chấm công thành công!');
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert('Đã xảy ra lỗi khi chấm công.');
    } finally {
      setLoading(false); // Hide loading modal
    }
  };
  

  return (
    <>
    <BackNav navigation={navigation} name={"Chấm công"} btn={"Lưu"} onEditPress={handleSaveAttendance} />

    <SafeAreaView style={styles.container}>
      {/* Header Section */}

      {/* Time Section */}
      <View style={styles.timeSection}>
        <View style={styles.timeInputs}>
          <Text style={styles.timeLabel}>Thời gian</Text>
          <TouchableOpacity style={styles.monthSelector} onPress={() => handleTimePickerVisibility('month')}>
            <Text style={styles.monthText}>{selectedMonth.toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
            <Icon name="arrow-drop-down" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.timeInputs}>
          <View style={styles.timeInputContainer}>
            <Text style={styles.timeLabel}>Vào</Text>
            <TouchableOpacity onPress={() => handleTimePickerVisibility('timeIn')}>
              <Text style={styles.timeText}>{timeIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timeInputContainer}>
            <Text style={styles.timeLabel}>Ra</Text>
            <TouchableOpacity onPress={() => handleTimePickerVisibility('timeOut')}>
              <Text style={styles.timeText}>{timeOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên hoặc mã nhân viên"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>
      {/* Dropdowns Section */}
      <View style={styles.dropdownContainer}>
      <View style={styles.dropdownWrapper}>
          <Text style={styles.label}>Trạng thái</Text>
          <DropDownPicker
            open={openStatus}
            value={valueStatus}
            items={items}
            setOpen={setOpenStatus}
            setValue={setValueStatus}
            placeholder="Chọn trạng thái"
            style={styles.dropdown} />
        </View>

        <View style={styles.dropdownWrapper}>
          <Text style={styles.label}>Phòng ban</Text>
          <DropDownPicker
            open={openPhongBan}
            value={valuePhongBan}
            items={phongBanItems}
            setOpen={setOpenPhongBan}
            setValue={setValuePhongBan}
            placeholder="Chọn phòng ban"
            style={styles.dropdown} />
        </View>
      </View>

      {/* Select All Checkbox */}
      <View style={styles.selectAllContainer}>
        <Text style={styles.selectAllText}>Chọn tất cả</Text>
        <TouchableOpacity onPress={toggleSelectAll}>
          <Icon
            name={selectAll ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={selectAll ? 'green' : 'gray'} />
        </TouchableOpacity>
      </View>

      {/* Employee List */}
      <ScrollView style={styles.employeeList}>
        {employees.map((employee, index) => (
          <View key={index} style={[styles.employeeItem, index % 2 === 0 ? styles.evenItem : styles.oddItem]}>
            <View>
              <Text style={styles.employeeName}>{employee.employeeId} {employee.name}</Text>
              <Text style={styles.employeeDepartment}>{employee.phongbanId}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleCheckmark(employee.employeeId)}>
              <Icon
                name={employee.trangthai === 'checked' ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={employee.trangthai === 'checked' ? 'green' : 'gray'} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal
        transparent={true}
        visible={loading}
        animationType="fade"
        onRequestClose={() => setLoading(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={styles.loadingText}>Đang chấm công...</Text>
          </View>
        </View>
      </Modal>
      {/* Time Pickers */}
      {showTimePicker.timeIn && (
        <DateTimePicker
          value={timeIn}
          mode="time"
          display="default"
          onChange={(event, date) => handleTimeChange(event, date, 'timeIn')} />
      )}

      {showTimePicker.timeOut && (
        <DateTimePicker
          value={timeOut}
          mode="time"
          display="default"
          onChange={(event, date) => handleTimeChange(event, date, 'timeOut')} />
      )}

      {showTimePicker.month && (
        <DateTimePicker
          value={selectedMonth}
          mode="date"
          display="default"
          onChange={handleMonthChange} />
      )}
    </SafeAreaView></>
  );
}


const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 15,
    height: 40,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  filterWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterSection: {
    borderWidth: 1,
    borderColor: "blue",
    flex: 1,
    marginHorizontal: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 150,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 15,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  timeSection: {
    backgroundColor: '#FFD700',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  timeLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  timeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    backgroundColor: '#fff',
    padding: 6,
    marginLeft: 8,
    width: 80,
    textAlign: 'center',
    borderRadius: 4,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    marginRight: 8,
    color: '#333',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 4,
  },
  dropdownContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  dropdownWrapper: {
    flex: 1,
    marginRight: 8,
  },
  dropdown: {
    borderColor: '#ccc',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedValue: {
    marginTop: 8,
    color: '#007BFF',
  },
  employeeList: {
    marginTop: 30,
    zIndex: 0,
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  evenItem: {
    backgroundColor: '#f8f8f8',
  },
  oddItem: {
    backgroundColor: '#e9e9e9',
  },
  employeeName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  employeeDepartment: {
    color: '#777',
  },selectAllContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  selectAllText: { fontSize: 16 },
});