import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Dashboard from "../../Compoment/Dashboard";
import { readEmployees, readPhongBan } from "../../services/database";
import { ref, onValue } from "firebase/database";
import { database } from "../../config/firebaseconfig"; // Đảm bảo bạn có cấu hình Firebase ở đây

const EmployeeScreen = ({ navigation, route }) => {
  const { employee } = route.params;
  const [listEmployeeMyPB, setListEmployeeMyPB] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0); // Thêm state cho nghỉ phép chưa xác nhận
  const date = new Date();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  // Lấy danh sách nhân viên
  const getListNV = async () => {
    const data = await readEmployees();
    const dataArr = Object.values(data);
    setListEmployee(dataArr);
    const newData = dataArr.filter(
      (nv) => nv.phongbanId == employee.phongbanId
    );
    setListEmployeeMyPB(newData);
    console.log("DATA:",newData);
  };

  // Lấy danh sách phòng ban
  const getListPB = async () => {
    const data = await readPhongBan();
    setListPhongBan(Object.values(data));
  };

  // Lấy số lượng nghỉ phép chưa xác nhận
  const getPendingLeaveCount = () => {
    const nghiPhepRef = ref(database, "nghiPhep");
    onValue(nghiPhepRef, (snapshot) => {
      let count = 0;
      snapshot.forEach((childSnapshot) => {
        const leaveData = childSnapshot.val();
        if (leaveData.trangThai === "0") {
          count++;
        }
      });
      setPendingLeaveCount(count);
    });
  };

  useEffect(() => {
    getListNV();
    getListPB();
    getPendingLeaveCount();
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView>
        <Dashboard
          listEmployee={listEmployeeMyPB}
          employee={employee}
          onPressChamCong={() => {
            navigation.navigate("ChiTietBangLuong", {
              employeeId: employee.employeeId,
            });
          }}
        />

        <View style={styles.container}>
          <Text style={styles.contentText}>Chức năng</Text>

          <Text style={styles.dateText}>
            Hôm nay, {date.toLocaleDateString("vi-VN")}
          </Text>

          <View style={styles.statsContainer}>
            <StatItem
              icon="user"
              color="#4CAF50"
              value={listEmployee.length}
              label="Nhân Viên"
              onPress={() => navigateTo("ListEmployee")}
            />
            <StatItem
              icon="id-badge"
              color="#F44336"
              value={listPhongBan.length}
              label="Phòng ban"
              onPress={() => navigateTo("PhongBanScreen")}
            />

            <StatItem
              icon="notifications"
              component={MaterialIcons}
              color="#9C27B0"
              value=""
              label="Thêm thông báo"
              onPress={() => {
                navigation.navigate("AddThongBao", { employee });
              }}
            />
            <StatItem
              icon="calendar-times-o"
              color="#2196F3"
              value={pendingLeaveCount} // Hiển thị số lượng nghỉ phép chưa duyệt
              label="Nghỉ phép"
              onPress={() => navigateTo("DuyetNghiPhep")}
            />
            <StatItem icon="money" color="#FFC107"  label="Lương" />
            <StatItem
              icon="fingerprint"
              component={MaterialIcons}
              color="#9C27B0"
              
              label="Chấm công nhân viên"
              onPress={() => navigation.navigate("ChamCongNV", {phongbanId: employee.phongbanId})}
            />
           
            <StatItem
              icon="fingerprint"
              component={MaterialIcons}
              color="#9C27B0"
              
              label="Thông tin chấm công"
              onPress={() => navigateTo("ThongTinChamCong")}
            />
            <StatItem 
            icon="tasks" 
            color="#FF9800" 
            value="0" 
            label="Nhiệm Vụ" 
            onPress={() => navigateTo("TaskScreen",{ employee })} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatItem = ({
  icon,
  component: IconComponent = FontAwesome,
  color,
  value,
  label,
  onPress,
}) => (
  <TouchableOpacity style={styles.statItem} onPress={onPress}>
    <IconComponent name={icon} size={28} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  contentText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  dateText: {
    textAlign: "center",
    marginVertical: 16,
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#E3F2FD",
    margin: 16,
    borderRadius: 8,
  },
  statItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default EmployeeScreen;
