import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { getEmployeeById } from "../../services/EmployeeFireBase";
import { layTatCaNhiemVu, layNhiemVuById, listenForTask } from "../../services/Task"; 

import BackNav from "../../Compoment/BackNav";


const TaskScreen = ({ route, navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { employee } = route.params || {}; // Employee passed from route params

  // Lấy danh sách nhiệm vụ ban đầu
  useEffect(() => {

    const fetchTasks = async () => {
     
      setLoading(true);
  
      try {
        // Fetch the employee details using the provided employee ID
        const emp = await getEmployeeById(employee);
         // `employee` is the ID here
        if (!emp) {
          console.error("Employee not found");
          setTasks([]);
          return;
        }
  
        const employeeId = emp.employeeId;
        const phongbanId = emp.phongbanId; // Department ID for department heads
        const chucvuId = emp.chucvuId; // Role ID (e.g., "TP" for department head)
  
        // Check if the user is a department head
        if (chucvuId !== "TP") {
          console.log("Only department heads can access this functionality");
          setTasks([]); // Clear tasks if the user is not authorized
          return;
        }
  
        // Fetch all tasks
        const tasksData = await layTatCaNhiemVu();
        if (tasksData) {
          // Filter tasks for the employee or their department
          const filteredTasks = Object.values(tasksData).filter((task) => {
            return task.employee === employeeId || task.phongbanId === phongbanId;
          });
  
          setTasks(filteredTasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [employee]);
  
  
  

  // Lắng nghe thay đổi trong danh sách nhiệm vụ
  useEffect(() => {
    if (!employee) return;

    const handleTaskUpdate = (updatedTasks) => {
      const updatedData = updatedTasks.map(async (task) => {
        try {
          const taskDetail = await layNhiemVuById(task.manhiemvu);
          return {
            employeeId: task.employeeId,
            manhiemvu: task.manhiemvu,
            taskName: taskDetail.taskName,
            startDate: taskDetail.startDate,
            endDate: taskDetail.endDate,
            assignedEmployees: taskDetail.assignedEmployees,
            trangThai: task.trangThai, // Trạng thái của nhiệm vụ
          };
        } catch (error) {
          console.error("Error fetching task details:", error);
        }
      });

      Promise.all(updatedData).then((newTaskData) => {
        setTasks(newTaskData.reverse()); // Đảo ngược thứ tự nếu cần hiển thị từ mới đến cũ
      });
    };

    listenForTask(employee.employeeId, handleTaskUpdate);

    return () => {
      // Hủy listener khi component unmount
      listenForTask(employee.employeeId, () => {});
    };
  }, [employee]);

  const handleTaskPress = async (task) => {
    try {
      const taskDetails = await layNhiemVuById(task.manhiemvu);
      if (taskDetails) {
        navigation.navigate("TaskDetail", { task: taskDetails, employee });
      } else {
        console.error("Task not found");
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const handleAddTask = () => {
    navigation.navigate("AddTask", { employee });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  // Check if the employee is a department head
  const isDepartmentHead = employee.chucvuId !== "NV"; // Assuming "GD" is the ID for trưởng phòng
  console.log(isDepartmentHead)
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackNav
          navigation={navigation}
          btn={isDepartmentHead ? "Thêm" : ""}
          name={"Nhiệm Vụ"}
          onEditPress={isDepartmentHead ? handleAddTask : null}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TouchableOpacity
              key={task.manhiemvu}
              style={styles.taskCard}
              onPress={() => handleTaskPress(task)}
            >
              <Text style={styles.taskTitle}>{task.taskName}</Text>
              <View style={styles.taskDetails}>
                <Text style={styles.detailText}>Start: {task.startDate}</Text>
                <Text style={styles.detailText}>End: {task.endDate}</Text>
                <Text style={styles.detailText}>Assigned to: {task.assignedEmployees}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noTasksText}>Không có nhiệm vụ nào!</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12,
  },
  taskDetails: {
    flexDirection: "column",
    marginBottom: 14,
  },
  detailText: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  noTasksText: {
    textAlign: "center",
    fontSize: 16,
    color: "#B0B0B0",
    marginTop: 40,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#B0B0B0",
  },
});

export default TaskScreen;
