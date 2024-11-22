import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import BackNav from "../../Compoment/BackNav";
import CalendarModal from "../../Compoment/CalendarModal";
import { getEmployeesInSameDepartmentForHead } from "../../services/EmployeeFireBase";
import { taoTaskDataBase, themTaskPhanCong } from "../../services/Task";

const AddTask = ({ navigation }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState("start");

  const [open, setOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await getEmployeesInSameDepartmentForHead();

        if (employeesData) {
          setEmployees(employeesData);
          setFilteredEmployees(employeesData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
      }
    };

    fetchEmployees();

    // Set default start and end dates
    const today = new Date();
    setStartDate(formatDate(today));

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    setEndDate(formatDate(nextDay));
  }, []);

  const handleAddTask = async () => {
    if (!taskName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên nhiệm vụ.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mô tả.");
      return;
    }
    if (selectedEmployees.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất một nhân viên.");
      return;
    }

    // Prepare task data to be created in Firebase
    const newTask = {
      taskName,
      description,
      startDate,
      endDate,
      assignedEmployees: selectedEmployees,
    };

    try {
      // Step 1: Create the task in the database
      const taskData = await taoTaskDataBase(newTask);

      // Step 2: Assign the task to the selected employees
      for (const employeeId of selectedEmployees) {
        await themTaskPhanCong(employeeId, taskData.manhiemvu);
      }

      console.log("Nhiệm vụ mới:", newTask);
      Alert.alert("Thành công", "Nhiệm vụ đã được thêm và phân công!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi thêm nhiệm vụ:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo nhiệm vụ.");
    }
  };

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
        setEndDate(formatDate(startDateObj));
      }
    } else {
      setEndDate(formattedDate);
    }
    setCalendarVisible(false);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        nestedScrollEnabled={true}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.header}>
          <BackNav name={"Giao nhiệm vụ"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tên nhiệm vụ</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên nhiệm vụ"
            value={taskName}
            onChangeText={setTaskName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ngày bắt đầu</Text>
          <TouchableOpacity
            onPress={() => handleOpenCalendar("start")}
            style={styles.datePicker}
          >
            <Text>{startDate}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ngày kết thúc</Text>
          <TouchableOpacity
            onPress={() => handleOpenCalendar("end")}
            style={styles.datePicker}
          >
            <Text>{endDate}</Text>
          </TouchableOpacity>
        </View>

        <CalendarModal
          visible={calendarVisible}
          selectedDate={selectedDateType === "start" ? startDate : endDate}
          onSelect={handleDateChange}
          onClose={() => setCalendarVisible(false)}
        />

        <View style={styles.section}>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Nhập mô tả"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Chỉ định cho</Text>
          <DropDownPicker
            open={open}
            value={employees}
            items={filteredEmployees}
            multiple={true}
            setOpen={setOpen}
            setValue={setSelectedEmployees}
            setItems={setFilteredEmployees}
            placeholder="Chọn nhân viên"
            style={styles.dropdown}
            dropDownContainerStyle={{
              ...styles.dropdownList,
              maxHeight: 150,
            }}
            listMode="SCROLLVIEW"
            nestedScrollEnabled={true}
          />
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Thêm nhiệm vụ</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  label: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  textArea: {
    height: 100,
  },
  datePicker: {
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dropdownContainer: {
    marginBottom: 16,
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  dropdownList: {
    backgroundColor: "#FFF",
    borderColor: "#E0E0E0",
    zIndex: 999,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddTask;
