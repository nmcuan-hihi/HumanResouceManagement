import React,{useEffect,useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import BackNav from "../../Compoment/BackNav";
import { Ionicons } from "@expo/vector-icons"; 

const TaskScreen = ({ navigation }) => {
    const tasks = [
      {
        id: 1,
        title: "Task number 01",
        time: "3h",
        assignedTo: "Nhân viên 1",
        description: "Hoàn thành mục 3 + 4 trong ...",
      },
      {
        id: 2,
        title: "Task number 02",
        time: "3h",
        assignedTo: "All",
        description: "Hoàn thành mục 3 + 4 trong ...",
      },
    ];
  
    const handleAddTask = () => {
      navigation.navigate("AddTask");
    };
  
    const handleTaskPress = (task) => {
      navigation.navigate("TaskDetail", { task });
    };
  
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BackNav
            navigation={navigation}
            btn={"Thêm"}
            name={"Nhiệm Vụ"}
            onEditPress={handleAddTask}
          />
        </View>
  
        {/* Task List */}
        <ScrollView>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              onPress={() => handleTaskPress(task)}
            >
              <Text style={styles.taskTitle}>{task.title}</Text>
              <View style={styles.taskDetails}>
                <Text style={styles.detailText}>{task.time}</Text>
                <Text style={styles.detailText}>• {task.assignedTo}</Text>
              </View>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backIcon: {
    marginRight: 8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
  },
  department: {
    fontSize: 14,
    color: "#757575",
  },
  addButton: {
    marginLeft: "auto",
  },
  taskCard: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#424242",
    marginRight: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#616161",
  },
});

export default TaskScreen;
