import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, TouchableOpacity } from 'react-native';
import BackNav from '../../Compoment/BackNav';
import { database } from '../../config/firebaseconfig'; // Import Firebase Realtime Database
import { ref, onValue } from "firebase/database"; // Import các phương thức từ firebase/database
import { store } from '../../redux/store';
import { getPhongBanById } from '../../services/InfoDataLogin';
import { color } from '@rneui/base';

export default function DuyetNghiPhep({ navigation,route }) {
  const { employee } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [nghiPhepData, setNghiPhepData] = useState([]);
  const [filter, setFilter] = useState(0); // State để quản lý bộ lọc
  const [tenPB, settenPb] = useState("");
    // Lấy idCty từ store
    const state = store.getState();
    const idCty = state.congTy.idCty;
  // Hàm lấy dữ liệu nghỉ phép
  const fetchData = async () => {
    try {
      const phongBanName = await getPhongBanById(employee.phongbanId);
      settenPb(phongBanName.tenPhongBan);
      setRefreshing(true);
  
      const nghiPhepRef = ref(database, `${idCty}/nghiPhep`); // Tham chiếu đến dữ liệu nghỉ phép
  
      onValue(nghiPhepRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Lọc dữ liệu có `department` trùng với `employee.phongbanId`
          const nghiPhepArray = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((item) => item.department === employee.phongbanId); // Lọc dựa trên điều kiện
  
          setNghiPhepData(nghiPhepArray); // Cập nhật state với dữ liệu đã lọc
        } else {
          setNghiPhepData([]); // Không có dữ liệu
        }
  
        setRefreshing(false);
      }, (error) => {
        console.error('Lỗi khi lắng nghe dữ liệu:', error);
        setRefreshing(false);
      });
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu nghỉ phép:', error);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchData();

    
    const nghiPhepRef = ref(database, `${idCty}/nghiPhep`);
    const unsubscribe = onValue(nghiPhepRef, (snapshot) => {
      const data = snapshot.val();
      const nghiPhepArray = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) : [];
      setNghiPhepData(nghiPhepArray);
    });

    return () => unsubscribe(); // Hủy đăng ký lắng nghe
  }, []);

  // Tính toán số ngày nghỉ
  const calculateDaysOff = (startDate, endDate) => {
    const start = new Date(startDate.split('/').reverse().join('-'));
    const end = new Date(endDate.split('/').reverse().join('-'));
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Lọc dữ liệu theo trạng thái
  const filteredData = nghiPhepData.filter(item => item.trangThai == filter);

  return (
    <>
      <BackNav navigation={navigation} name="Duyệt Nghỉ Phép" />
      <View style={styles.container}>
      <View style={[styles.depart]}>
            <Text style={[styles.filterText, {color: "blue"}]}>Phòng: {tenPB}</Text>
          </View>
        <View style={styles.filterContainer}>
         
          <TouchableOpacity style={[styles.filterButton, filter === 0 && styles.activeNewButton]} onPress={() => setFilter(0)}>
            <Text style={styles.filterText}>Mới</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, filter === 1 && styles.activeApprovedButton]} onPress={() => setFilter(1)}>
            <Text style={styles.filterText}>Đã duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, filter === -1 && styles.activeCancelledButton]} onPress={() => setFilter(-1)}>
            <Text style={styles.filterText}>Hủy</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} // Sắp xếp theo ngày tạo
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const numberOfDaysOff = calculateDaysOff(item.ngayBatDau, item.ngayKetThuc);
            const itemStyle = item.trangThai == "1" ? styles.approvedItem : item.trangThai === "-1" ? styles.cancelledItem : styles.newItem;
            return (
              <TouchableOpacity style={[styles.itemContainer, itemStyle]}
                onPress={() => {
                  navigation.navigate("ChiTietNghiPhep", { nghiPhepData: item });
                }}
              >
                <Text style={styles.textEmployeeName}>{item.employeeName} - {item.department}</Text>
                <Text style={styles.textLeaveStartDate}>{item.ngayBatDau}</Text>
                <Text style={styles.textLeaveDays}>Số ngày nghỉ: {numberOfDaysOff} ngày</Text>
              </TouchableOpacity>
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 13,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    width: "25%",
    alignItems: "center",
    padding: 5,
    backgroundColor: '#d3d3d3',
  },
  depart: {
    width: "50%",
    alignItems: "baseline",
    paddingBottom: 5,
    marginLeft: 20,
    backgroundColor: '#fff',
  },
  activeNewButton: {
    backgroundColor: '#4682b4',
  },
  activeApprovedButton: {
    backgroundColor: '#90ee90',
  },
  activeCancelledButton: {
    backgroundColor: '#ffd700',
  },
  filterText: {
    color: '#000',
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
  },
  newItem: {
    backgroundColor: '#f0f8ff',
  },
  approvedItem: {
    backgroundColor: '#90ee90',
  },
  cancelledItem: {
    backgroundColor: '#ffd300',
  },
  textEmployeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f4f4f',
  },
  textLeaveStartDate: {
    fontSize: 14,
    color: '#8b0000',
  },
  textLeaveDays: {
    fontSize: 14,
    color: '#4682b4',
  },
});
