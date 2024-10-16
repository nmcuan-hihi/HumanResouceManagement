import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import Dashboard from '../../Compoment/Dashboard';
import DashboardEmployee from '../../Compoment/FunctionEmployee';

export default function EmployeeScreen() {
  return (
    <View style={styles.wrapper}>
      {/* Render the Dashboard at the top */}
      <Dashboard />

      {/* Additional content for functionality */}
      <View style={styles.container}>
        <Text style={styles.contentText}>Chức năng</Text>
        <View style={styles.gridContainer}>

        <DashboardEmployee name="Nhân viên" icon="user" />
        <DashboardEmployee name="Tìm kiếm" icon="search" />
        <DashboardEmployee name="Phòng ban" icon="home"/>
        <DashboardEmployee name="Nhiệm vụ" icon="th-large"/>
        <DashboardEmployee name="Nghỉ phép" icon="0"/>


          {/* <TouchableOpacity style={styles.gridItem}>
            <FontAwesome name="user" size={20} color="#2E2E2E" />
            <Text style={styles.gridLabel}>Nhân viên</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <FontAwesome name="search" size={20} color="#2E2E2E" />
            <Text style={styles.gridLabel}>Tìm kiếm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <FontAwesome name="home" size={20} color="#2E2E2E" />
            <Text style={styles.gridLabel}>Phòng ban</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <FontAwesome name="th-large" size={20} color="#2E2E2E" />
            <Text style={styles.gridLabel}>Nhiệm vụ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem}>
            <Text style={styles.leaveText}>0</Text>
            <Text style={styles.gridLabel}>Nghỉ phép</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // Ensure the component takes up the entire screen space
    backgroundColor: '#fff', // White background for the screen
  },
  container: {
    flex: 1, // Flex for the inner content
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'flex-start', // Align items to the start (left)
    marginTop: 150, // Space from the Dashboard
    padding: 20,
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20, // Space below the header text
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '18%', // Percentage width for responsive design
    backgroundColor: '#C3E3E7', // Light turquoise for grid items
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 10,
  },
  gridLabel: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '500',
    color: '#2E2E2E',
  },
  leaveText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E2E2E',
  },
});
