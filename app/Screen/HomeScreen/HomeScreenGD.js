import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Icon from "react-native-vector-icons/MaterialIcons";
import DashboardGD from "../../Compoment/DashboardGD";
import { readEmployees, readPhongBan } from "../../services/database";
import Chart from "../../Compoment/Chart"; // Import biểu đồ
import { TouchableOpacity } from "react-native";

const FirstRoute = ({ data }) => (
  <View style={[styles.scene]}>
    <Chart data={data} title="Biểu đồ 1" />
  </View>
);

const SecondRoute = ({ data }) => (
  <View style={[styles.scene]}>
    <Chart data={data} title="Biểu đồ 2" />
  </View>
);

const ThirdRoute = ({ data }) => (
  <View style={[styles.scene]}>
    <Chart data={data} title="Biểu đồ 3" />
  </View>
);

const FourthRoute = ({ data }) => (
  <View style={[styles.scene]}>
    <Chart data={data} title="Biểu đồ 4" />
  </View>
);

export default function HomeScreenGD({ navigation, route }) {
  const { employee } = route.params;
  const [listEmployee, setListEmployee] = useState([]);
  const [listPhongBan, setListPhongBan] = useState([]);

  const date = new Date();

  // Lấy danh sách nhân viên
  const getListNV = async () => {
    const data = await readEmployees();
    setListEmployee(Object.values(data));
    console.log(listEmployee);
  };

  // Lấy danh sách phòng ban
  const getListPB = async () => {
    const data = await readPhongBan();
    setListPhongBan(Object.values(data));
    console.log(listPhongBan, "pb");
  };

  useEffect(() => {
    getListNV();
    getListPB();
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
       showsVerticalScrollIndicator={false}

      >
        <DashboardGD listEmployee={listEmployee} listPhongBan={listPhongBan} />
        <Text style={styles.dateText}>
          Hôm nay, {date.toLocaleDateString("vi-VN")}
        </Text>
        <View style={styles.summaryCard}>
          <View>
            <Chart />
          </View>
        </View>
      
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate("ListEmployee")}
          >
            <Icon name="person" size={24} color="#2196F3" />
            <Text style={styles.statValue}>Nhân viên</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => {
              navigation.navigate("NotificeScreen");
            }}
          >
            <Icon name="notifications" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>Thông báo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => {
              navigation.navigate("PhongBanScreen");
            }}
          >
            <Icon name="house" size={24} color="#FFC107" />
            <Text style={styles.statValue}>Phòng ban</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem} onPress={() => {navigation.navigate('ListChucVu')}}>
            <Icon name="badge" size={24} color="#F44336" />
            <Text style={styles.statValue}>Chức Vụ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate("QuanLyMucLuong")}
          >
            <Icon name="credit-card" size={24} color="#9C27B0" />
            <Text style={styles.statValue}>Quản lý mức lương</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate("DanhSachBangCap")}
          >
            <Icon name="book" size={24} color="#FF9966" />
            <Text style={styles.statValue}>Bằng cấp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate("Skill")}
          >
            <Icon name="book" size={24} color="#FF9966" />
            <Text style={styles.statValue}>Kỹ năng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
  },
  summaryCard: {
    backgroundColor: "#E3F2FD",
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryValue: {
    fontWeight: "bold",
  },
  scene: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    backgroundColor: "#E3F2FD",
  },
  tabLabel: {
    color: "#000",
  },
  tabIndicator: {
    backgroundColor: "#2196F3",
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
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 4,
    textAlign: "center",
  },
});
