import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import ItemListEmployee from '../../Compoment/ItemEmployee';
import BackNav from '../../Compoment/BackNav';
import { readEmployees } from '../../services/database'; // Nhập hàm đọc dữ liệu

export default function EmployeeList({ navigation }) {
  const [employeeData, setEmployeeData] = useState([]); // State để lưu dữ liệu nhân viên

  useEffect(() => {
    // Gọi hàm để đọc dữ liệu nhân viên khi component được mount
    const fetchData = async () => {
      const data = await readEmployees();
      // Chuyển đổi dữ liệu thành mảng
      const employeeArray = Object.keys(data).map(key => ({
        ...data[key],
        manv: key // Thêm mã nhân viên từ key
      }));
      setEmployeeData(employeeArray); // Cập nhật state
    };

    fetchData(); // Gọi hàm fetchData
  }, []); // Chạy một lần khi component mount

  const handlePress = (item) => {
    navigation.navigate('EmployeeDetail', { manv: item.manv, name: item.name });
  };
  const handlePress1 = (item) => {
    navigation.navigate('AddEmployee');
  };
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <BackNav navigation={navigation} name={"Danh sách nhân viên"} soLuong={employeeData.length} btn={"Add"}  onEditPress={handlePress1}/>
      </View>

      {/* Employee List */}
      <FlatList
        style={{ marginTop: 20 }} // Adjust margin as needed
        data={employeeData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <ItemListEmployee manv={item.manv} name={item.name} imageUrl={item.imageUrl} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.manv} // Sử dụng mã nhân viên làm khóa
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
});
