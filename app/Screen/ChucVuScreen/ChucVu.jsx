import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BackNav from '../../Compoment/BackNav';
import { readChucVu } from '../../services/database'; // Nhập hàm đọc dữ liệu chức vụ
import ItemListEmployee from '../../Compoment/ItemEmployee';

export default function ListChucVu({ navigation }) {
  const [chucVuData, setChucVuData] = useState([]); // State để lưu dữ liệu chức vụ

  const handleAddChucVu = () => {
    navigation.navigate("AddChucVu"); // Điều hướng tới màn hình thêm chức vụ
  }

  useEffect(() => {
    // Gọi hàm để đọc dữ liệu chức vụ khi component được mount
    const fetchData = async () => {
      const data = await readChucVu();
      if (data) { // Kiểm tra xem dữ liệu có tồn tại không
        // Chuyển đổi dữ liệu thành mảng
        const chucVuArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key // Thêm ID chức vụ từ key
        }));
        setChucVuData(chucVuArray); // Cập nhật state
      }
    };

    fetchData(); // Gọi hàm fetchData
  }, []); // Chạy một lần khi component mount

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <BackNav 
          navigation={navigation} 
          name={"Danh sách chức vụ"} 
          soLuong={chucVuData.length} 
          btn={"Add"} 
          onAddPress={handleAddChucVu} // Thêm sự kiện cho nút "Add"
        />
      </View>

      {/* Chức vụ List */}
      <FlatList
        style={{ marginTop: 20 }} // Điều chỉnh khoảng cách nếu cần
        data={chucVuData}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer}>
           
         <ItemListEmployee manv={item.loaichucvu}  name={item.hschucvu}/>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id} // Sử dụng ID chức vụ làm khóa
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 20,
  },
  headerSection: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Add space between BackNav and number text
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
  },
  itemSubText: {
    fontSize: 14,
    color: '#555', // Màu sắc nhẹ cho nhãn
  },
});