import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Dashboard = () => {
  return (
    <View style={styles.container}>
      {/* Phần chào hỏi */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Chào User Nhân viên</Text>
        <Text style={styles.subText}>Phòng IT</Text>
      </View>

      {/* Phần Tổng Quan */}
      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>Tổng Quan</Text>

        <View style={styles.statsContainer}>
          {/* Nhiệm vụ hôm nay */}
          <View style={[styles.statBox, styles.statBoxYellow]}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Nhiệm vụ hôm nay</Text>
          </View>

          {/* Nhóm của bạn */}
          <View style={[styles.statBox, styles.statBoxGreen]}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Nhóm của bạn</Text>
          </View>

          {/* Số giờ làm trong tháng */}
          <View style={[styles.statBox, styles.statBoxBlue]}>
            <Text style={styles.statNumber}>42 Giờ</Text>
            <Text style={styles.statLabel}>Số giờ làm trong tháng</Text>
          </View>

          {/* Số ngày làm trong tháng */}
          <View style={[styles.statBox, styles.statBoxCyan]}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Số ngày làm trong tháng</Text>
          </View>
        </View>
      </View>

      {/* Nút chức năng */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Chấm công của bạn</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Đăng ký nghỉ phép</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  overview: {
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  statBoxYellow: {
    backgroundColor: '#FFEB3B',
  },
  statBoxGreen: {
    backgroundColor: '#4CAF50',
  },
  statBoxBlue: {
    backgroundColor: '#2196F3',
  },
  statBoxCyan: {
    backgroundColor: '#00BCD4',
  },
  button: {
    backgroundColor: '#00BFFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;