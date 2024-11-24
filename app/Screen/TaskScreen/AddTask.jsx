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
import { useRoute } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import BackNav from "../../Compoment/BackNav";
import CalendarModal from "../../Compoment/CalendarModal";
import { readPhongBanFromRealtime } from "../../services/PhongBanDatabase";
import { readEmployeesFireStore } from "../../services/EmployeeFireBase";
import { getEmployeeById } from "../../services/EmployeeFireBase";
import { taoTaskDataBase, themTaskPhanCong } from "../../services/Task";

const AddTask = ({ navigation }) => {
  const route = useRoute();
  const { employee } = route.params || {};
  console.log(employee)
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState("start");
  const [open, setOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [phongBans, setPhongBans] = useState("");
  const [searchPB, setSearchPB] = useState(
    employee.phongbanId ? employee.phongbanId : ""
  );
  const [listNV, setListNV] = useState([]);

  const [listNVPB, setListNVPB] = useState([]);



  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesData = await readEmployeesFireStore();
    
        // Kiểm tra thông tin người đăng nhập
       
       
        // Lọc Trưởng phòng cùng phòng ban với người đăng nhập
    
       const getNV = await getEmployeeById(employee);

  console.log("Thông tin người đăng nhập:", getNV);
    
        // Lọc danh sách nhân viên cùng phòng ban (trừ Trưởng phòng và Giám đốc)
        const filteredEmployees = employeesData.filter(
          (emp) =>
            emp.phongbanId === getNV.phongbanId && // Cùng phòng ban với Trưởng phòng
            emp.chucvuId !== "TP" && // Không phải Trưởng phòng
            emp.chucvuId !== "GD" // Không phải Giám đốc
        );
    
        console.log("Danh sách nhân viên cùng phòng ban:", filteredEmployees);
    
        // Cập nhật danh sách nhân viên
        if (filteredEmployees.length > 0) {
          setEmployees(filteredEmployees);
        } else {
          Alert.alert("Thông báo", "Không có nhân viên phù hợp trong phòng ban.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
        Alert.alert("Lỗi", "Không thể lấy danh sách nhân viên: " + error.message);
      }
    };
    
   
    // Chỉ fetch nếu có thông tin về phòng ban của nhân viên

    fetchEmployees();
   
    // Initialize dates
    const today = new Date();
    setStartDate(formatDate(today));

    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    setEndDate(formatDate(nextDay));
  }, [employee]);

  // const fetchPhongBan = async () => {
  //   try {
  //     const data = await readPhongBanFromRealtime();
  //     if (data) {
  //       const phongBanArray = Object.values(data).map((p) => ({
  //         label: p.tenPhongBan,
  //         value: p.maPhongBan,
          
  //       }));

  //       setPhongBans(phongBanArray);
  //       console.log(phongBans)
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi lấy phòng ban:", error);
  //   }
  // };

  // const locNhanVienPb = () => {
  //   if (searchPB == "all" || !searchPB) {
  //     setListNVPB(listNV);
  //   } else {
  //     const data = listNV.filter((nv) => {
  //       return nv.phongbanId == searchPB;
  //     });
  //     setListNVPB(data);
  //   }
  // };
  // useEffect(() => {
  //   locNhanVienPb();
  // }, [searchPB, listNV]);
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddTask = async () => {
    if (!taskName.trim() || !description.trim() || selectedEmployees.length === 0) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
      return;
    }
   
    const newTask = { taskName, description, startDate, endDate,employee};

    try {
      const taskData = await taoTaskDataBase(newTask);
      for (const employeeId of selectedEmployees) {
        await themTaskPhanCong(employeeId, taskData.manhiemvu);
      }
      Alert.alert("Thành công", "Nhiệm vụ đã được thêm!");
      navigation.goBack();
    } catch (error) {
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
      const startDateObj = new Date(newDate);
      startDateObj.setDate(startDateObj.getDate() + 1);
      setEndDate(formatDate(startDateObj));
    } else {
      setEndDate(formattedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <BackNav name={"Giao nhiệm vụ"} />
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
          <TouchableOpacity onPress={() => handleOpenCalendar("start")} style={styles.datePicker}>
            <Text>{startDate}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Ngày kết thúc</Text>
          <TouchableOpacity onPress={() => handleOpenCalendar("end")} style={styles.datePicker}>
            <Text>{endDate}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mô tả nhiệm vụ"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Chọn nhân viên</Text>
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            items={employees.map((emp) => ({ label: emp.name, value: emp.employeeId }))}
            value={selectedEmployees}
            setValue={setSelectedEmployees}
            multiple={true}
            style={styles.dropdown}
            placeholder="Chọn nhân viên"
            listMode="SCROLLVIEW"
            dropDownContainerStyle={styles.dropdownList}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddTask}>
          <Text style={styles.buttonText}>Thêm nhiệm vụ</Text>
        </TouchableOpacity>
        <CalendarModal
          visible={calendarVisible}
          selectedDate={selectedDateType === "start" ? startDate : endDate}
          onSelect={handleDateChange}
          onClose={() => setCalendarVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex:0,
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
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AddTask;
