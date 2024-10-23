import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const DashboardGD = ({ listEmployee, listPhongBan }) => {
  return (
    <View style={styles.container}>
      {/* Phần chào hỏi */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Giám đốc</Text>
        <Icon name="waving-hand" size={24} color="#FFA000" />
      </View>

      {/* Phần Tổng Quan */}
      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>Tổng Quan</Text>
        <View style={styles.statsContainer}>
          {/* Nhiệm vụ hôm nay */}
          <View style={[styles.statBox, styles.statBoxYellow]}>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/meeting.png")}
            />
            <Text style={styles.statNumber}>{listPhongBan.length}</Text>
            <Text style={styles.statLabel}>Phòng ban</Text>
          </View>

          {/* Nhóm của bạn */}
          <View style={[styles.statBox, styles.statBoxGreen]}>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/user.png")}
            />
            <Text style={styles.statNumber}>{listEmployee.length}</Text>
            <Text style={styles.statLabel}>Nhân viên</Text>
          </View>

          {/* Lương nhân viên */}
          <View style={[styles.statBox, styles.statBoxYellow]}>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/money-bag.png")}
            />
            <Text style={styles.statNumber}>Chưa có </Text>
            <Text style={styles.statLabel}>Lương nhân viên</Text>
          </View>

          {/* Khen thưởng */}
          <View style={[styles.statBox, styles.statBoxCyan]}>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/badge.png")}
            />
            <Text style={styles.statNumber}>chưa có</Text>
            <Text style={styles.statLabel}>Khen thưởng</Text>
          </View>
        </View>
      </View>

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#ffff", // Thêm màu nền để làm nổi bật
    flex: 1,
  },
  header: {
    marginBottom: 20,
   
    flexDirection: "row",
    alignItems: "center", // Canh giữa icon và chữ
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1, // Cho phép chữ chiếm không gian còn lại
  },  
  overviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statBox: {
    width: "48%",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    backgroundColor: "#fff", // Thêm màu nền cho ô thống kê
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  statBoxYellow: {
    backgroundColor: "#FFEB3B",
  },
  statBoxGreen: {
    backgroundColor: "#4CAF50",
  },
  statBoxCyan: {
    backgroundColor: "#00BCD4",
  },
  iconImage: {
    width: 30,
    height: 30,
    position: "absolute",
    top: 15, // Điều chỉnh vị trí biểu tượng
    right: 15,
  },
});

export default DashboardGD;
