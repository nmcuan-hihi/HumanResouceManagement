import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { layTatCaNhiemVu } from "../../services/Task"; 
import { getEmployeeById } from "../../services/EmployeeFireBase"; // Import your function
import BackNav from "../../Compoment/BackNav";
import { database } from "../../config/firebaseconfig";

const TaskScreen = ({ route,navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState(null); // Store employee data

  useEffect(() => {
    const employee = route.params?.employee; // Access employee from route.params
    if (employee && employee.employeeId) {
      // Fetch employee data using employeeId
      const fetchEmployeeData = async () => {
        try {
          const data = await getEmployeeById(employee.employeeId);
          setEmployeeData(data);
          console.log("Employee Data:", data);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };

      fetchEmployeeData();
    } else {
      console.log("No employee ID found.");
    }

    const fetchTasks = async () => {
      try {
        const tasksData = await layTatCaNhiemVu();
        if (tasksData) {
          const taskArray = Object.values(tasksData);
          setTasks(taskArray);
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
  }, [route.params]); // Add route.params as a dependency to ensure it updates when params change

  const handleAddTask = () => {
    navigation.navigate("AddTask");
  };

  const handleTaskPress = (task) => {
    navigation.navigate("TaskDetail", { task });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackNav
          navigation={navigation}
          btn={"Thêm"}
          name={"Nhiệm Vụ"}
          onEditPress={handleAddTask}
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
    backgroundColor: "#FAFAFA",  // Lighter background color
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
    elevation: 8,  // Elevated shadow for Android
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
    flexWrap: 'wrap',  // Allow text to wrap
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
