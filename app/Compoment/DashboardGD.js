import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Hàm định dạng ngày hiện tại thành chuỗi "dd/mm/yyyy"
const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
};

const DashboardGD = ({ listEmployee, listPhongBan }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Giám đốc</Text>
        <Icon name="waving-hand" size={24} color="#FFA000" />
      </View>

      <View style={styles.overview}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Tổng Quan</Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statBox, styles.statBoxYellow]}>
            <Icon
              name="meeting-room"
              size={30}
              color="blue"
              style={styles.icon}
            />
            <Text style={styles.statNumber}>{listPhongBan.length}</Text>
            <Text style={styles.statLabel}>Phòng ban</Text>
          </View>

          <View style={[styles.statBox, styles.statBoxGreen]}>
            <Icon name="group" size={26} color="yellow" style={styles.icon} />
            <Text style={styles.statNumber}>{listEmployee.length}</Text>
            <Text style={styles.statLabel}>Nhân viên</Text>
          </View>

          <View style={[styles.statBox, styles.statBoxYellow]}>
            <Icon name="attach-money" size={24} color="#000" style={styles.icon} />
            <Text style={styles.statNumber}>Chưa có</Text>
            <Text style={styles.statLabel}>Lương nhân viên</Text>
          </View>

          <View style={[styles.statBox, styles.statBoxCyan]}>
            <Icon name="star" size={30} color="orange" style={styles.icon} />
            <Text style={styles.statNumber}>Chưa có</Text>
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
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  overview: {
    marginBottom: 20,
  },
  overviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#777",
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
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: 10,
    right: 10,
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
});

export default DashboardGD;
