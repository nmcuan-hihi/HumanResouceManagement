import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Dashboard from '../../Compoment/Dashboard';
import { getEmployeeById } from '../../services/InfoDataLogin';

export default function ChammCong({ navigation, route }) {
  const { keyID } = route.params || {}; // Lấy keyID từ params
  const [userLogin, setUserLogin] = useState(null); // State để lưu thông tin nhân viên

  // Lấy thông tin nhân viên khi component được render
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getEmployeeById(keyID); // Đợi dữ liệu từ Firebase
        setUserLogin(data); // Lưu dữ liệu vào state
        console.log("Data:", JSON.stringify(data, null, 2)); // Log dữ liệu để kiểm tra
      } catch (error) {
        console.error("Error fetching user data:", error); // Xử lý lỗi
      }
    };

    fetchUserData(); // Gọi hàm lấy dữ liệu
  }, [keyID]); // Chỉ gọi lại khi keyID thay đổi

  const handlePress = () => {
    navigation.navigate('ChamCongNV'); // Điều hướng đến màn hình chấm công
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* <Dashboard employee={userLogin}/> */}
        <Dashboard />

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text>Tổng nhân viên</Text>
            <Text style={styles.summaryValue}>120</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tổng lương</Text>
            <Text style={styles.summaryValue}>1000 tỷ đồng</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tổng giờ làm</Text>
            <Text style={styles.summaryValue}>1000 giờ</Text>
          </View>
          <View style={styles.chartPlaceholder} />
        </View>

        <Text style={styles.dateText}>Hôm nay, 20/09/2024</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="alarm-add" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Tăng ca, làm thêm</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="access-time" size={24} color="#F44336" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Đi trễ</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="event-busy" size={24} color="#2196F3" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Nghỉ phép</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="attach-money" size={24} color="#FFC107" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Lương</Text>
          </View>

          <TouchableOpacity onPress={handlePress} style={styles.statItem}>
            <Icon name="fingerprint" size={24} color="#9C27B0" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Chấm công nhân viên</Text>
          </TouchableOpacity>

          <View style={styles.statItem}>
            <Icon name="star" size={24} color="#FF9800" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Thưởng, phụ cấp</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    margin: 10,
  },
  summaryCard: {
    backgroundColor: '#FFF9C4',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: 'bold',
  },
  chartPlaceholder: {
    height: 100,
    backgroundColor: '#FFD54F',
    borderRadius: 50,
    marginTop: 16,
  },
  dateText: {
    textAlign: 'center',
    marginVertical: 16,
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
    width: '30%',
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
