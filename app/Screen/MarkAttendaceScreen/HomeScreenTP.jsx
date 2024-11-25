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
import { readEmployees, readPhongBan } from "../../services/database";

export default function HomScreenTPKT({ navigation, route }) {
  const { employee } = route.params;
  const [listEmployeeMyPB, setListEmployeeMyPB] = useState([]);
  const [listEmployee, setListEmployee] = useState([]);

  const [listPhongBan, setListPhongBan] = useState([]);

  const date = new Date();
  const handlePress = () => {
    navigation.navigate("ChamCongNV", {phongbanId: employee.phongbanId}); // Điều hướng đến màn hình chấm công
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Dashboard listEmployee={listEmployeeMyPB} employee={employee} onPressChamCong={() => {
          navigation.navigate("ChiTietBangLuong", {
            employeeId: employee.employeeId,
          });
        }} />

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text>Tổng nhân viên</Text>
            <Text style={styles.summaryValue}>{listEmployee.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tổng lương</Text>
            <Text style={styles.summaryValue}>Chưa có </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tổng giờ làm</Text>
            <Text style={styles.summaryValue}>Chưa có</Text>
          </View>
          <View style={styles.chartPlaceholder} />
        </View>

        <Text style={styles.dateText}>
          Hôm nay, {date.toLocaleDateString("vi-VN")}
        </Text>

        <View style={styles.statsContainer}>
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
          <TouchableOpacity onPress={() => navigation.navigate('DuyetNghiPhep')} style={styles.statItem}>
            <Icon name="event-busy" size={24} color="#2196F3" />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Duyệt nghỉ phép</Text>
          </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    margin: 10,
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
    marginVertical: 16,
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
