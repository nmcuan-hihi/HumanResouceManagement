import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon

import { getPhongBanById } from "../services/InfoDataLogin";
import { getTasksForEmployee } from "../services/Task"; // Assuming you have a service to fetch tasks
import { useNavigation } from "@react-navigation/native";

const Dashboard = ({ listEmployee, employee, onPressChamCong }) => {
  const [phongBan, setPhongBan] = useState(null);
  const [tasks, setTasks] = useState([]);  // State to store tasks
  const phongbanId = employee?.phongbanId;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPhongBan = async () => {
      if (phongbanId) {
        const data = await getPhongBanById(phongbanId);
        if (data) {
          setPhongBan(data);
        }
      }
    };
    fetchPhongBan();
  }, [phongbanId]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (employee?.employeeId) {
        const tasksData = await getTasksForEmployee(employee?.employeeId); // Fetch tasks for the employee
        if (Array.isArray(tasksData)) {
          setTasks(tasksData); // Set tasks to state
        }
      }
    };
    fetchTasks();
  }, [employee]);

  return (
    <View style={styles.container}>
      {/* Phần chào hỏi */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Chào <Text style={{ color: "blue" }}>{employee?.name}</Text>
        </Text>
        <Text style={styles.subText}>
          {phongBan ? `Phòng ${phongBan.tenPhongBan}` : "Đang tải..."}
        </Text>
      </View>

      {/* Phần Tổng Quan */}
      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>Tổng Quan</Text>

        <View style={styles.statsContainer}>
          {/* Nhiệm vụ hôm nay */}
          <View style={[styles.statBox, styles.statBoxYellow]}>
            <Text style={styles.statNumber}>
              {tasks.length > 0 ? tasks.length : "Chưa có"} {/* Display total number of tasks */}
            </Text>
            <Text style={styles.statLabel}>Nhiệm vụ hôm nay</Text>
            <Icon name="assignment" size={24} color="#000" style={styles.absoluteIcon} />
          </View>

          {/* Nhóm của bạn */}
          <View style={[styles.statBox, styles.statBoxGreen]}>
            <Text style={styles.statNumber}>
              {listEmployee.length} <Text style={{ fontSize: 12 }}>Thành Viên</Text>
            </Text>
            <Text style={styles.statLabel}>Nhóm của bạn</Text>
            <Icon name="group" size={24} color="#000" style={styles.absoluteIcon} />
          </View>

          {/* Số giờ làm trong tháng */}
          <View style={[styles.statBox, styles.statBoxBlue]}>
            <Text style={styles.statNumber}>Chưa có</Text>
            <Text style={styles.statLabel}>Số giờ làm trong tháng</Text>
            <Icon name="access-time" size={24} color="#000" style={styles.absoluteIcon} />
          </View>

          {/* Số ngày làm trong tháng */}
          <View style={[styles.statBox, styles.statBoxCyan]}>
            <Text style={styles.statNumber}>Chưa có</Text>
            <Text style={styles.statLabel}>Số ngày làm trong tháng</Text>
            <Icon name="calendar-today" size={24} color="#000" style={styles.absoluteIcon} />
          </View>
        </View>
      </View>

      {/* Nút chức năng */}
      <TouchableOpacity style={styles.button} onPress={onPressChamCong}>
        <Text style={styles.buttonText}>Chấm công của bạn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {
        navigation.navigate("DangKyNghi", { employee: employee });
      }}>
        <Text style={styles.buttonText}>Đăng ký nghỉ phép</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {
        navigation.navigate("TaskScreen", { employee: employee });
      }}>
        <Text style={styles.buttonText}>Nhiệm vụ của tôi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 16,
    color: "red",
  },
  overview: {
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    position: 'relative',
  },
  absoluteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  statBoxYellow: {
    backgroundColor: "#FFEB3B",
  },
  statBoxGreen: {
    backgroundColor: "#4CAF50",
  },
  statBoxBlue: {
    backgroundColor: "#2196F3",
  },
  statBoxCyan: {
    backgroundColor: "#00BCD4",
  },
  button: {
    backgroundColor: "#00BFFF",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Dashboard;
