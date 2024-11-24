import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import BackNav from "../../Compoment/BackNav";
import { updateAssignedTaskStatus, getAssignedTask } from "../../services/Task";

const TaskDetail = ({ navigation }) => {
  const route = useRoute();
  const { task } = route.params;
  const { employee } = route.params || {};
  const [isCompleted, setIsCompleted] = useState();
  const isEmployee = employee?.chucvuId === 'NV';

  useEffect(() => {
    const fetchTaskStatus = async () => {
      if (isEmployee) {
        // Fetch status for employee
        try {
          const assignedTask = await getAssignedTask(employee.employeeId, task.manhiemvu);
          if (assignedTask) {
            setIsCompleted(assignedTask.trangthai || false);
          }
        } catch (error) {
          Alert.alert("Error", "Failed to fetch assigned task");
        }
      } else {
        // For TP (Trưởng phòng), get status directly from task
        setIsCompleted(task.trangthai || false);
      }
    };
  
    if (employee && task) {
      fetchTaskStatus();
    }
  }, [task, employee, isEmployee]);


  const handleToggleCompletion = async () => {
    try {
      const newStatus = !isCompleted;
      setIsCompleted(newStatus);
      const result = await updateAssignedTaskStatus(
        employee.employeeId, 
        task.manhiemvu, 
        newStatus
      );
      if (result) {
        Alert.alert("Success", `Task marked as ${newStatus ? "completed" : "not completed"}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update task status");
    }
  };

  // Component to render status based on role
  const renderStatusComponent = () => {
    if (employee?.chucvuId === 'NV') { // Nhân viên
      return (
        <TouchableOpacity
          style={[styles.button, isCompleted ? styles.completedButton : styles.notCompletedButton]}
          onPress={handleToggleCompletion}
        >
          <Text style={styles.buttonText}>
            {isCompleted ? "✅ Đã hoàn thành" : "❌ Chưa hoàn thành"}
          </Text>
        </TouchableOpacity>
      );
    } else { // Trưởng phòng
      return (
        <View style={styles.statusTextContainer}>
          <Text style={[
            styles.statusText,
            isCompleted ? styles.completedText : styles.notCompletedText
          ]}>
            {isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackNav name={"Chi tiết nhiệm vụ"} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Tên nhiệm vụ</Text>
        <Text style={styles.value}>{task?.taskName}</Text>
      </View>

      <View style={styles.rowSection}>
        <View style={styles.timeSection}>
          <Text style={styles.label}>Thời gian bắt đầu</Text>
          <Text style={styles.value}>{task?.startDate}</Text>
        </View>
        <View style={styles.timeSection}>
          <Text style={styles.label}>Thời gian kết thúc</Text>
          <Text style={styles.value}>{task?.endDate}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Chi tiết</Text>
        <Text style={styles.value}>{task?.description || "No description available."}</Text>
      </View>

      {renderStatusComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  timeSection: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#757575",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  completedButton: {
    backgroundColor: "#4CAF50",
  },
  notCompletedButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  statusTextContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  completedText: {
    color: "#4CAF50",
  },
  notCompletedText: {
    color: "#F44336",
  }
});

export default TaskDetail;