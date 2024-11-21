import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import BackNav from "../../Compoment/BackNav";
import CalendarModal from "../../Compoment/CalendarModal";
import { readEmployeesFireStore } from "../../services/EmployeeFireBase";

const AddTask = ({ navigation }) => {
  const [search, setSearch] = useState(""); // Tìm kiếm
  const [open, setOpen] = useState(false); // Mở dropdown
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Nhân viên đã chọn (nhiều nhân viên)
  const [employees, setEmployees] = useState([]); // Danh sách nhân viên gốc
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Danh sách nhân viên sau khi lọc

  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc
  const [calendarVisible, setCalendarVisible] = useState(false); // Hiển thị modal lịch
  const [selectedDateType, setSelectedDateType] = useState("start"); // Loại ngày (bắt đầu/kết thúc)

  useEffect(() => {
    // Lấy danh sách nhân viên từ Firebase
    const fetchEmployees = async () => {
      try {
        const data = await readEmployeesFireStore();
        if (data && Array.isArray(data)) {
          // Dữ liệu là mảng
          const employeeArray = data
            .filter((employee) => employee.chucvuId === "TP") // Lọc nhân viên có chức vụ là trưởng phòng
            .map((employee) => ({
              label: employee.name, // Hiển thị tên
              value: employee.employeeId, // Mã nhân viên
              ...employee,
            }));
          setEmployees(employeeArray);
          setFilteredEmployees(employeeArray); // Đặt dữ liệu ban đầu cho danh sách lọc
        } else if (data && typeof data === "object") {
          // Dữ liệu là object
          const employeeArray = Object.keys(data)
            .map((key) => data[key])
            .filter((employee) => employee.chucvuId === "TP") // Lọc nhân viên có chức vụ là trưởng phòng
            .map((employee) => ({
              label: employee.name,
              value: employee.employeeId,
              ...employee,
            }));
          setEmployees(employeeArray);
          setFilteredEmployees(employeeArray);
        } else {
          console.warn("Dữ liệu nhân viên không hợp lệ:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
      }
    };

    fetchEmployees();

    // Đặt mặc định ngày bắt đầu và ngày kết thúc
    const today = new Date();
    const formattedStartDate = formatDate(today);
    setStartDate(formattedStartDate);

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    const formattedEndDate = formatDate(nextDay);
    setEndDate(formattedEndDate);
  }, []);

  // Lọc nhân viên theo tìm kiếm
  useEffect(() => {
    const filtered = employees.filter((employee) =>
      employee.label.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [search, employees]);

  const handleOpenCalendar = (dateType) => {
    setSelectedDateType(dateType);
    setCalendarVisible(true);
  };

  const handleDateChange = (newDate) => {
    const formattedDate = formatDate(new Date(newDate));

    if (selectedDateType === "start") {
      setStartDate(formattedDate);
      const startDateObj = parseDate(formattedDate);
      if (startDateObj) {
        startDateObj.setDate(startDateObj.getDate() + 1);
        const formattedEndDate = formatDate(startDateObj);
        setEndDate(formattedEndDate);
      }
    } else {
      setEndDate(formattedDate);
    }

    setCalendarVisible(false);
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    const parsedDate = new Date(`${year}-${month}-${day}`);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSelectAll = () => {
    const allEmployeeIds = filteredEmployees.map((employee) => employee.value);
    setSelectedEmployees(allEmployeeIds); // Chọn tất cả nhân viên
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackNav name={"Giao nhiệm vụ"} />
      </View>

      {/* Task Details */}
      <View style={styles.section}>
        <Text style={styles.label}>Tên nhiệm vụ</Text>
        <Text style={styles.value}>Design Changes</Text>
      </View>

      {/* Ngày bắt đầu */}
      <View style={styles.section}>
        <Text style={styles.label}>Ngày bắt đầu</Text>
        <TouchableOpacity
          onPress={() => handleOpenCalendar("start")}
          style={styles.datePicker}
        >
          <Text>{startDate}</Text>
        </TouchableOpacity>
      </View>

      {/* Ngày kết thúc */}
      <View style={styles.section}>
        <Text style={styles.label}>Ngày kết thúc</Text>
        <TouchableOpacity
          onPress={() => handleOpenCalendar("end")}
          style={styles.datePicker}
        >
          <Text>{endDate}</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <CalendarModal
        visible={calendarVisible}
        selectedDate={selectedDateType === "start" ? startDate : endDate}
        onSelect={handleDateChange}
        onClose={() => setCalendarVisible(false)}
      />
      <View style={styles.sectionRow}>
        <View style={styles.timeSection}>
          <Text style={styles.label}>Start Time</Text>
          <Text style={styles.value}>01:22 pm</Text>
        </View>
        <View style={styles.timeSection}>
          <Text style={styles.label}>End Time</Text>
          <Text style={styles.value}>03:20 pm</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Mô tả</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Tìm kiếm theo tên"
        value={search}
        onChangeText={setSearch}
      />

      {/* Chọn tất cả nhân viên */}
      

      {/* Dropdown chọn nhân viên */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Chỉ định cho</Text>
        <DropDownPicker
        
          open={open}
          value={selectedEmployees}
          items={filteredEmployees}
          multiple={true} // Cho phép chọn nhiều nhân viên
           
          setOpen={setOpen}
          setValue={setSelectedEmployees}
          setItems={setFilteredEmployees}
          placeholder="Chọn nhân viên"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
           dropDownDirection="BOTTOM"
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeSection: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#424242",
  },
  searchBar: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  dropdownList: {
    backgroundColor: "#FFF",
    borderColor: "#E0E0E0",
  },
  selectedEmployee: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
  },
  datePicker: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectAllButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectAllText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default AddTask;
