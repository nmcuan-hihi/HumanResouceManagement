import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; // Import FontAwesome và MaterialIcons
import Dashboard from '../../Compoment/Dashboard';

const EmployeeScreen = ({ navigation }) => {
  const handlePress1 = () => {
    navigation.navigate('ListEmployee');
  };
  const handlePress = () => {
    navigation.navigate('PhongBanScreen');
  };

  // Danh sách các chức năng
  const functions = [
    { name: 'Nhân viên', icon: 'user', onPress: handlePress1 },
    { name: 'Phòng ban', icon: 'home', onPress: handlePress },
    { name: 'Nhiệm vụ', icon: 'tasks' },
    { name: 'Nghỉ phép', icon: 'calendar' },
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView>
        {/* Dashboard */}
        <Dashboard />

        {/* Nội dung chính */}
        <View style={styles.container}>
          <Text style={styles.contentText}>Chức năng</Text>

          {/* Ngày hiện tại */}
          <Text style={styles.dateText}>Hôm nay, 20/09/2024</Text>

          {/* Khối thống kê */}
          <View style={styles.statsContainer}>
            <StatItem
              icon="user"
              color="#4CAF50"
              value="0"
              label="Nhân Viên"
              onPress={handlePress1}
            />
            <StatItem
              icon="id-badge"
              color="#F44336"
              value="0"
              label="Phòng ban"
            />
            <StatItem
              icon="calendar-times-o"
              color="#2196F3"
              value="0"
              label="Nghỉ phép"
            />
            <StatItem
              icon="money"
              color="#FFC107"
              value="0"
              label="Lương"
            />
            <StatItem
              icon="fingerprint" // Dùng MaterialIcons cho biểu tượng vân tay
              component={MaterialIcons} // Sử dụng MaterialIcons cho vân tay
              color="#9C27B0"
              value="0"
              label="Chấm công nhân viên"
            />
            <StatItem
              icon="tasks"
              color="#FF9800"
              value="0"
              label="Nhiệm Vụ"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Component hiển thị mục thống kê
const StatItem = ({ icon, component: IconComponent = FontAwesome, color, value, label }) => (
  <View style={styles.statItem}>
    <IconComponent name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',

    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  gridItem: {
    width: '40%', // Hiển thị 2 cột trên mỗi hàng
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#2E2E2E',
  },
  dateText: {
    textAlign: 'center',
    marginVertical: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#E3F2FD',
    margin: 16,
    borderRadius: 8,
  },
  statItem: {
    width: '30%', // Mỗi hàng có 3 mục
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default EmployeeScreen;
