import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ItemListEmployee from '../../Compoment/ItemEmployee';
import BackNav from '../../Compoment/BackNav';
import { readEmployees } from '../../services/database';
import { readPhongBan1 } from '../../services/database'; // Nhập hàm đọc phòng ban
import { filterEmployeesByPhongBan, filterEmployeesByGender, filterEmployeesByStatus ,searchEmployeesByNameOrId } from '../../services/PhongBanDatabase';

export default function EmployeeList({ navigation }) {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhongBan, setSelectedPhongBan] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [phongBanList, setPhongBanList] = useState([]); // State để lưu danh sách phòng ban

  useEffect(() => {
    const fetchData = async () => {
      const data = await readEmployees();
      if (data) {
        const employeeArray = Object.keys(data).map(key => ({
          ...data[key],
          manv: key
        }));
        setEmployeeData(employeeArray);
        setFilteredData(employeeArray);
      }

      // Lấy danh sách phòng ban
      const phongBans = await readPhongBan1();
      setPhongBanList(phongBans); // Cập nhật danh sách phòng ban
    };

    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = async () => {
      let filteredResults = employeeData;

      if (selectedPhongBan) {
        filteredResults = await filterEmployeesByPhongBan(selectedPhongBan);
      }

      if (selectedGender) {
        filteredResults = await filterEmployeesByGender(selectedGender);
      }

      if (selectedStatus) {
        filteredResults = await filterEmployeesByStatus(selectedStatus);
      }

      setFilteredData(filteredResults);
    };

    applyFilters();
  }, [selectedPhongBan, selectedGender, selectedStatus, employeeData]);

  const handlePress = (item) => {
    navigation.navigate('EmployeeDetail', { manv: item.manv });
  };

  const handleAddEmployee = () => {
    navigation.navigate('AddEmployee');
  };

 // Hàm tìm kiếm theo tên hoặc mã nhân viên
 const handleSearch = async () => {
  if (searchTerm.trim() === '') {
    setFilteredData(employeeData); // Reset lại nếu không có dữ liệu tìm kiếm
  } else {
    // Tìm kiếm theo tên hoặc mã nhân viên
    const searchResults = await searchEmployeesByNameOrId(searchTerm);
    // Chuyển đổi kết quả từ đối tượng thành mảng
    const employeeArray = Object.keys(searchResults).map(key => ({
      ...searchResults[key],
      manv: key // Thêm mã nhân viên vào mỗi nhân viên
    }));
    setFilteredData(employeeArray); // Cập nhật kết quả tìm kiếm
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <BackNav 
          navigation={navigation} 
          name={"Danh sách nhân viên"} 
          soLuong={filteredData.length} 
          btn={"Add"} 
          onEditPress={handleAddEmployee} 
        />
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên hoặc mã nhân viên"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button title="Tìm kiếm" onPress={handleSearch} />
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Picker
          selectedValue={selectedPhongBan}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedPhongBan(itemValue)}
        >
          <Picker.Item label="Phòng ban" value="" />
          {phongBanList.map((phongBan) => (
            <Picker.Item key={phongBan.maPhongBan} label={phongBan.tenPhongBan} value={phongBan.maPhongBan} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedGender}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedGender(itemValue)}
        >
          <Picker.Item label="Giới tính" value="" />
          <Picker.Item label="Nam" value="Nam" />
          <Picker.Item label="Nữ" value="Nữ" />
        </Picker>

        <Picker
          selectedValue={selectedStatus}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedStatus(itemValue)}
        >
          <Picker.Item label="Trạng thái" value="" />
          <Picker.Item label="Đang làm" value="active" />
          <Picker.Item label="Đã nghỉ" value="inactive" />
        </Picker>
      </View>

      {/* Employee List */}
      <FlatList
        style={{ marginTop: 20 }}
        data={filteredData}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <ItemListEmployee manv={item.manv} name={item.name} imageUrl={item.imageUrl} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.manv}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  picker: {
    height: 50,
    width: 120,
    marginRight: 10,
  },
});
