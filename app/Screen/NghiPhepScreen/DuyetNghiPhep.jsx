import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, TouchableOpacity } from 'react-native';
import BackNav from '../../Compoment/BackNav';
import { layDanhSachNghiPhep } from '../../services/NghiPhepDB';
import { database } from '../../config/firebaseconfig'; // Import Firebase Realtime Database
import { ref, onValue } from "firebase/database"; // Import các phương thức từ firebase/database

export default function DuyetNghiPhep({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [nghiPhepData, setNghiPhepData] = useState([]);

  // Hàm lấy dữ liệu nghỉ phép
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const nghiPhep = await layDanhSachNghiPhep();
      setNghiPhepData(nghiPhep.data);
    } catch (error) {
      console.error('Lỗi khi fetching dữ liệu:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const nghiPhepRef = ref(database, 'nghiPhep'); // Tham chiếu đến dữ liệu nghỉ phép trong Realtime Database
    const unsubscribe = onValue(nghiPhepRef, (snapshot) => {
      const data = snapshot.val();
      const nghiPhepArray = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      })) : [];
      setNghiPhepData(nghiPhepArray);
    });

    return () => unsubscribe(); // Hủy lắng nghe khi component bị hủy
  }, []);

  const onRefresh = async () => {
    await fetchData();
  };

  const calculateDaysOff = (startDate, endDate) => {
    const start = new Date(startDate.split('/').reverse().join('-'));
    const end = new Date(endDate.split('/').reverse().join('-'));
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <>
      <BackNav navigation={navigation} name="Duyệt Nghỉ Phép" />
      <View style={styles.container}>
        <FlatList
          data={nghiPhepData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} // Sắp xếp dữ liệu theo thứ tự ngược lại
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const numberOfDaysOff = calculateDaysOff(item.ngayBatDau, item.ngayKetThuc);
            return (
              <TouchableOpacity style={styles.itemContainer}
              onPress={()=>{
                navigation.navigate("ChiTietNghiPhep", {nghiPhepData: item})
              }}
              >
                <Text style={styles.textEmployeeName}>{item.employeeName} - {item.department}</Text>
                <Text style={styles.textLeaveStartDate}>{item.ngayBatDau}</Text>
                <Text style={styles.textLeaveDays}>Số ngày nghỉ: {numberOfDaysOff} ngày</Text>
              </TouchableOpacity>
            );
          }}
          
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  itemContainer: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
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
