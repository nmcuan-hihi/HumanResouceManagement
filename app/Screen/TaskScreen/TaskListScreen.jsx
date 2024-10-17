import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const TaskListScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

  const tasks = [
    {
      id: '1',
      title: 'Task number 01',
      time: '3h',
      role: 'Nhân viên 1',
      status: 'Hoàn thành mục 3/4 trang...',
      startDate: '03/10/2022, 3:44 am',
      detail: 'Reference site about Lorem Ipsum...',
    },
    {
      id: '2',
      title: 'Task number 02',
      time: '3h',
      role: 'All',
      status: 'Hoàn thành mục 3/4 trang...',
      startDate: '04/10/2022, 2:00 pm',
      detail: 'Another reference site for Ipsum...',
    },
  ];

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TaskDetail', { task: item })}>
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={styles.taskInfo}>
          <Text style={styles.taskDetail}>⏱ {item.time}</Text>
          <Text style={styles.taskDetail}>👤 {item.role}</Text>
        </View>
        <Text style={styles.taskStatus}>📍 {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Chào UserTrưởng Phòng</Text>
          <Text style={styles.departmentText}>Phòng IT</Text>
        </View>
        {/* Add Task Button with Navigation */}
        <TouchableOpacity onPress={() => navigation.navigate('AddTask')}>
          <Ionicons name="add-circle-outline" size={24} color="#6A5ACD" />
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  departmentText: {
    fontSize: 14,
    color: '#555',
  },
  taskList: {
    paddingHorizontal: 20,
  },
  taskCard: {
    backgroundColor: '#E0E7FF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  taskDetail: {
    fontSize: 14,
    color: '#555',
  },
  taskStatus: {
    fontSize: 14,
    color: '#555',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
});

export default TaskListScreen;
