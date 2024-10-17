import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome
import Dashboard from '../../Compoment/Dashboard';
import DashboardEmployee from '../../Compoment/FunctionEmployee';

export default function EmployeeScreen({ navigation }) {
  const handlePress1 = () => {
    navigation.navigate('ListEmployee');
  };
  const handlePress = () => {
    navigation.navigate('PhongBanScreen');
  };

  return (
    <View style={styles.wrapper}>
      {/* Render the Dashboard at the top */}
      <Dashboard />

      {/* Additional content for functionality */}
      <View style={styles.container}>
        <Text style={styles.contentText}>Chức năng</Text>
        <View style={styles.gridContainer}>
          <DashboardEmployee name="Nhân viên" icon="user" onPress={handlePress1} />
          <DashboardEmployee name="Tìm kiếm" icon="search" />
          <DashboardEmployee name="Phòng ban" icon="home" onPress={handlePress} />
          <DashboardEmployee name="Nhiệm vụ" icon="th-large" />
          <DashboardEmployee name="Nghỉ phép" icon="th-large" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Màu nền nhẹ để tạo sự tương phản
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20, // Giảm khoảng cách từ Dashboard
    padding: 20,
  },
  contentText: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '18%',
    backgroundColor: '#C3E3E7',
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 10,
    shadowColor: "#000", // Đổ bóng
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Hiệu ứng đổ bóng cho Android
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
