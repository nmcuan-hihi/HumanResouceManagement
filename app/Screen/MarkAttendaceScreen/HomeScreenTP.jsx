import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Dashboard from "../../Compoment/Dashboard";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ref, onValue } from "firebase/database";
import { readEmployees, readPhongBan } from "../../services/database";
import { database } from "../../config/firebaseconfig"; 
import { store } from "../../redux/store";
export default function HomScreenTPKT({ navigation, route }) {
  const { employee } = route.params;
  const [listEmployeeMyPB, setListEmployeeMyPB] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0); 
  const [listPhongBan, setListPhongBan] = useState([]);
 // Lấy idCty từ store
 const state = store.getState();
 const idCty = state.congTy.idCty;
  const date = new Date();
  
  const handlePress = () => {
    navigation.navigate("ChamCongNV", {phongbanId: employee.phongbanId}); // Điều hướng đến màn hình chấm công
  };
 // Lấy số lượng nghỉ phép chưa xác nhận
 const getPendingLeaveCount = () => {
  const nghiPhepRef = ref(database, `${idCty}/nghiPhep`);
  onValue(nghiPhepRef, (snapshot) => {
    let count = 0;
    snapshot.forEach((childSnapshot) => {
      const leaveData = childSnapshot.val();
      if (leaveData.trangThai === "0" && leaveData.department == employee.phongbanId) {
        count++;
      }
    });
    setPendingLeaveCount(count);
  });
};
  //lấy ds nhân viên

  const getListNV = async () => {
    const data = await readEmployees();

    const dataArr = Object.values(data);
    setListEmployee(dataArr);
    const newData = dataArr.filter((nv) => {
      return nv.phongbanId == employee.phongbanId;
    });

    setListEmployeeMyPB(newData);
    console.log(newData);
  };

  // lấy danh sách pb

  const getListPB = async () => {
    const data = await readPhongBan();

    setListPhongBan(Object.values(data));
  };

  useEffect(() => {
    getListNV();
    getListPB();
    getPendingLeaveCount();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Dashboard listEmployee={listEmployeeMyPB} employee={employee} onPressChamCong={() => {
          navigation.navigate("ChiTietBangLuong", {
            employeeId: employee.employeeId,
          });
        }} />

        
<Text style={styles.contentText}>Chức năng</Text>
        <Text style={styles.dateText}>
          Hôm nay, {date.toLocaleDateString("vi-VN")}
        </Text>

        <View style={styles.statsContainer}>
        <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate("ListEmployee",{phongbanId: employee.phongbanId, chucvu_id: employee.chucvuId})}
          >
            <Icon name="person" size={24} color="#2196F3" />
            <Text style={styles.statValue}></Text>
            <Text style={styles.statLabel}>Nhân viên</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AddThongBao',{ employee })} style={styles.statItem}>
            <Icon name="alarm-add" size={24} color="#4CAF50" />
            <Text style={styles.statValue}></Text>
            <Text style={styles.statLabel}>Thông báo</Text>
          </TouchableOpacity>

          
          <TouchableOpacity onPress={() => navigation.navigate("TaskScreen",  { employee:employee })} style={styles.statItem}>
            <Icon name="access-time" size={24} color="#F44336" />
            <Text style={styles.statValue}></Text>
            <Text style={styles.statLabel}>Giao nhiệm vụ</Text>
          </TouchableOpacity>
          <StatItem
              icon="calendar-times-o"
              color="#2196F3"
              value={pendingLeaveCount} // Hiển thị số lượng nghỉ phép chưa duyệt
              label="Nghỉ phép"
              onPress={() => navigateTo("DuyetNghiPhep", {employee: employee})}
            />

          <TouchableOpacity onPress={handlePress} style={styles.statItem}>
            <Icon name="fingerprint" size={24} color="#9C27B0" />
            <Text style={styles.statValue}></Text>
            <Text style={styles.statLabel}>Chấm công nhân viên</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
   
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#FFF9C4",
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryValue: {
    fontWeight: "bold",
  },
  chartPlaceholder: {
    height: 100,
    backgroundColor: "#FFD54F",
    borderRadius: 50,
    marginTop: 16,
  },
  dateText: {
    textAlign: "center",

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