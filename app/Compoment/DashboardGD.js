import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
const DashboardGD = () => {
  return (
    <View style={styles.container}>
      {/* Phần chào hỏi */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Giám đốc</Text>
        <Text style={{ width: 20 }}></Text>
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
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Phòng ban</Text>
          </View>

          {/* Nhóm của bạn */}
          <View style={[styles.statBox, styles.statBoxGreen]}>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/user.png")}
            />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Nhân viên</Text>
          </View>

          {/* Số giờ làm trong tháng */}
          <View style={[styles.statBox, styles.statBoxYellow]}>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/money-bag.png")}
            />
            <Text style={styles.statNumber}></Text>
            <Text style={styles.statLabel}>Lương nhân viên</Text>
          </View>

          {/* Số ngày làm trong tháng */}
          <View style={[styles.statBox, styles.statBoxCyan]}>
            <Image
              style={styles.iconImage}
              source={require("../../assets/images/badge.png")}
            />
            <Text style={styles.statNumber}></Text>
            <Text style={styles.statLabel}>Khen thưởng</Text>
          </View>
        </View>
      </View>
      <Text style={[styles.overviewTitle, { color: "blue" }]}>Chức năng</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 16,
    color: "#888",
  },
  overview: {
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  statBoxBlue: {
    backgroundColor: "#2196F3",
  },
  statBoxCyan: {
    backgroundColor: "#00BCD4",
  },
  button: {
    backgroundColor: "#00BFFF",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  iconImage: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 0,
    margin: 10,
  },
});

export default DashboardGD;
