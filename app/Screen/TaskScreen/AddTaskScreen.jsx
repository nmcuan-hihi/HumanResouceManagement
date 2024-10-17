import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for the checkmark

const AddTaskScreen = () => {
  const [assignedUsers, setAssignedUsers] = useState([
    { id: 'E002', name: 'Rahul Kumar', avatar: 'https://example.com/avatar.jpg', checked: false },
    // Add more users as needed
  ]);

  const toggleCheckbox = (userId) => {
    setAssignedUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, checked: !user.checked } : user
      )
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <TouchableOpacity style={styles.checkbox} onPress={() => toggleCheckbox(item.id)}>
          {/* Display the icon if the checkbox is checked */}
          {item.checked && <Icon name="check" size={16} color="#00BFFF" />}
        </TouchableOpacity>
        <Text style={styles.userId}>{item.id}</Text>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Chào User Trưởng Phòng</Text>
        <Text style={styles.subText}>Phòng IT</Text>
         
      </View>

      {/* Task Information */}
      <View style={styles.taskInfo}>
        <Text style={styles.label}>Tên</Text>
        <Text style={styles.infoText}>Design Changes</Text>

        <Text style={styles.label}>Ngày</Text>
        <Text style={styles.infoText}>Oct 4, 2020</Text>

        <View style={styles.timeContainer}>
          <View>
            <Text style={styles.label}>Start Time</Text>
            <Text style={styles.timeText}>01:22 pm</Text>
          </View>
          <View>
            <Text style={styles.label}>End Time</Text>
            <Text style={styles.timeText}>03:20 pm</Text>
          </View>
        </View>

        <Text style={styles.label}>Mô tả</Text>
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, er adipiscing elit, sed dianummy nibh euismod dolor sit amet, er adipiscing elit, sed dianummy nibh euismod.
        </Text>
      </View>

      {/* Search Bar */}
      <TextInput style={styles.searchBar} placeholder="Tìm kiếm theo tên" />

      {/* Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Chỉ định cho</Text>
        <Text style={styles.filterText}>Tất cả</Text>
      </View>

      {/* Assigned Users */}
      <FlatList
        data={assignedUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        style={styles.userList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: '#888',
  },
  taskInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 16,
    color: '#555',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginVertical: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#888',
  },
  userList: {
    marginBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#00BFFF',
    marginRight: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userId: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default AddTaskScreen;
