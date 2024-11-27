import React, { useState, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { readPhongBanFromRealtime } from '../../services/PhongBanDatabase';
import { addChiTietChamCongToRealtime } from '../../services/chamcong';
import BackNav from '../../Compoment/BackNav';
import { searchEmployeesByNameOrId } from '../../services/PhongBanDatabase';
import { getDatabase, ref, get, set, update, serverTimestamp } from 'firebase/database';
import { getEmployeesWithLeave } from '../../services/chamcong';
import { getEmployeesByLeaveType, getFilteredEmployeesByPhongBanAndLeave } from '../../services/chamcong';
import { CheckBox } from 'react-native-elements';
import { store } from '../../redux/store';

export default function ChamCongNV({ navigation, route }) {
  const { phongbanId } = route.params || {};
  console.log(phongbanId);

  const [attendanceType, setAttendanceType] = useState('timeIn'); // New state for radio buttons
  const [timeIn, setTimeIn] = useState(() => {
    const defaultTimeIn = new Date();
    defaultTimeIn.setHours(9, 0, 0, 0);
    return defaultTimeIn;
  });
  const [timeOut, setTimeOut] = useState(() => {
    const defaultTimeOut = new Date();
    defaultTimeOut.setHours(17, 0, 0, 0);
    return defaultTimeOut;
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
  const [loading, setLoading] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [valueStatus, setValueStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lockedEmployeeIds, setLockedEmployeeIds] = useState(new Set());
  useEffect(() => {
    async function fetchEmployees() {
      try {
        const formattedDate = new Date(selectedMonth).toLocaleDateString('vi-VN');
        const employeesData = await getFilteredEmployeesByPhongBanAndLeave(phongbanId, formattedDate);
        
        if (employeesData) {
          setEmployees(employeesData);
          const employeesWithCheckboxTrue = employeesData.filter(employee => employee.trangthaiCheckbox);
          console.log("Nhân viên có trangthaiCheckbox = true:", employeesWithCheckboxTrue);
          
          // Tạo Set mới để lưu ID của nhân viên cần khóa
          const newLockedIds = new Set();
          
          employeesWithCheckboxTrue.forEach(employee => {
            toggleCheckmark(employee.employeeId);
            newLockedIds.add(employee.employeeId);
          });
          
          // Set locked IDs và isInitialized sau khi xử lý xong
          setLockedEmployeeIds(newLockedIds);
          setIsInitialized(true);
        }
      } catch (error) {
        console.log("Error fetching employees:", error);
      }
    }

    async function fetchPhongBan() {
      try {
        const phongBanData = await readPhongBanFromRealtime();
        if (phongBanData) {
          const filteredPhongBan = phongBanData.filter(pban => pban.maPhongBan === phongbanId);
          setPhongBan(filteredPhongBan);
        }
      } catch (error) {
        console.log("Error fetching phong ban:", error);
      }
    }

    fetchEmployees();
    fetchPhongBan();
  }, [selectedMonth, phongbanId]);



  useEffect(() => {
    if (employees && employees.phongbanId !== phongbanId) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [employees, phongbanId]);
  useEffect(() => {
    const fetchExistingTimeIn = async (employeeId) => {
      try {
        const state = store.getState();
        const idCty = state.congTy.idCty; // Lấy idCty từ Redux store
        const date = new Date(selectedMonth);
        const year = date.getFullYear();
        const monthName = date.getMonth() + 1;
        const day = date.getDate();
        
        const database = getDatabase();
        const chamCongRef = ref(database, `${idCty}/chitietchamcong/${employeeId}/${year}/${monthName}/${day}`);
        const snapshot = await get(chamCongRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.timeIn) {
            // Convert timeIn string back to Date object
            const [time, period] = data.timeIn.split(' ');
            const [hours, minutes] = time.split(':');
            const timeInDate = new Date(selectedMonth);
            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            timeInDate.setHours(hour, parseInt(minutes));
            setTimeIn(timeInDate);
          }
        }
      } catch (error) {
        console.log("Error fetching existing timeIn:", error);
      }
    };
  
    if (attendanceType === 'timeOut') {
      const selectedEmployees = employees.filter(employee => employee.trangthai === 'checked');
      selectedEmployees.forEach(employee => fetchExistingTimeIn(employee.employeeId));
    }
  }, [attendanceType, selectedMonth, employees]);
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
      console.log("Error filtering employees by phòng ban:", error);
    }
  };

  const handleFilterEmployeesByStatus = async (phongbanId) => {
    try {
      const filteredEmployees = await getEmployeesByLeaveType(phongbanId);
      setEmployees(filteredEmployees);
    } catch (error) {
      console.log("Error filtering employees by phòng ban:", error);
    }
  };

  const handleTimeChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || (type === 'timeIn' ? timeIn : timeOut);
    setShowTimePicker(prev => ({ ...prev, [type]: Platform.OS === 'ios' && false }));
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

  const toggleCheckmark = (employeeId) => {
    // Chỉ khóa những nhân viên có ID trong danh sách locked
    if (lockedEmployeeIds.has(employeeId)) return;
    
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
        trangthai: selectAll
          ? 'unchecked' // Nếu `selectAll` là `true`, bỏ chọn tất cả
          : (employee.trangthai === 'checked' ? 'checked' : 'checked') // Nếu chưa check, chọn nó
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

  
// Cập nhật trong component ChamCongNV
const handleSaveAttendance = async () => {
  setLoading(true);
  try {
    const selectedEmployees = employees.filter(employee => employee.trangthai === 'checked');
    if (selectedEmployees.length === 0) {
      alert('Vui lòng chọn ít nhất một nhân viên để chấm công');
      setLoading(false);
      return;
    }

    const errors = [];
    for (const employee of selectedEmployees) {
      try {
        const attendanceData = {
          employeeId: employee.employeeId,
          status: "di_lam",
          month: selectedMonth,
          ...(attendanceType === 'timeIn' 
            ? { timeIn } 
            : { timeIn: null, timeOut }),
        };
        await addChiTietChamCongToRealtime(attendanceData);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (errors.length > 0) {
      alert(`Có lỗi xảy ra:\n${errors.join('\n')}`);
    } else {
      alert('Chấm công thành công!');
    }
  } catch (error) {
    console.log("Error saving attendance:", error);
    alert('Đã xảy ra lỗi khi chấm công.');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <BackNav navigation={navigation} name={"Chấm công"} btn={"Lưu"} onEditPress={handleSaveAttendance} />
      <SafeAreaView style={styles.container}>
        {/* Time Section */}
        <View style={styles.timeSection}>
          <View style={styles.radioContainer}>
            <TouchableOpacity 
              style={styles.radioButton} 
              onPress={() => setAttendanceType('timeIn')}
            >
              <View style={styles.radio}>
                {attendanceType === 'timeIn' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioText}>Vào</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.radioButton} 
              onPress={() => setAttendanceType('timeOut')}
            >
              <View style={styles.radio}>
                {attendanceType === 'timeOut' && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioText}>Ra</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeInputs}>
            <Text style={styles.timeLabel}>Thời gian</Text>
            <TouchableOpacity style={styles.monthSelector} onPress={() => handleTimePickerVisibility('month')}>
              <Text style={styles.monthText}>
                {selectedMonth.toLocaleDateString([], { day: '2-digit', month: 'long', year: 'numeric' })}
              </Text>
              <Icon name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.timeInputs}>
            {attendanceType === 'timeIn' && (
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeLabel}>Vào</Text>
                <TouchableOpacity onPress={() => handleTimePickerVisibility('timeIn')}>
                  <Text style={styles.timeText}>
                    {timeIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {attendanceType === 'timeOut' && (
              <View style={styles.timeInputContainer}>
                <Text style={styles.timeLabel}>Ra</Text>
                <TouchableOpacity onPress={() => handleTimePickerVisibility('timeOut')}>
                  <Text style={styles.timeText}>
                    {timeOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        

        <View style={styles.selectAllContainer}>
          <Text style={styles.selectAllText}>Chọn tất cả</Text>
          <TouchableOpacity onPress={toggleSelectAll}>
            <Icon
              name={selectAll ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={selectAll ? 'green' : 'gray'}
            />
          </TouchableOpacity>
        </View>

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
                  color={employee.trangthai === 'checked' ? 'green' : 'gray'}
                />
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

        {showTimePicker.timeIn && (
          <DateTimePicker
            value={timeIn}
            mode="time"
            display="default"
            onChange={(event, date) => handleTimeChange(event, date, 'timeIn')}
          />
        )}

        {showTimePicker.timeOut && (
          <DateTimePicker
            value={timeOut}
            mode="time"
            display="default"
            onChange={(event, date) => handleTimeChange(event, date, 'timeOut')}
          />
        )}

        {showTimePicker.month && (
          <DateTimePicker
            value={selectedMonth}
            mode="date"
            display="default"
            onChange={handleMonthChange}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  // Styles hiện có
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
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
  // Thêm styles mới cho radio buttons
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  // Styles hiện có tiếp theo
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
  dropdownContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 20,
    zIndex: 1000,
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
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 80,
  },
  selectAllText: {
    fontSize: 16
  },
});