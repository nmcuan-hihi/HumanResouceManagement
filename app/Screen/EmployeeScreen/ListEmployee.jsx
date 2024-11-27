import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Text, RefreshControl } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ItemListEmployee from '../../Compoment/ItemEmployee';
import BackNav from '../../Compoment/BackNav';
import { readPhongBanFromRealtime } from '../../services/PhongBanDatabase';
import { filterEmployeesByPhongBan, filterEmployeesByGender, filterEmployeesByStatus, searchEmployeesByNameOrId } from '../../services/PhongBanDatabase';
import { readEmployeesFireStore } from '../../services/EmployeeFireBase';
import { locTheoPhongBan } from '../../services/chamcong';
import { useFocusEffect } from '@react-navigation/native';
import { getEmployeesWithLeave2 } from '../../services/chamcong';
export default function EmployeeList({ navigation , route}) {
  const { phongbanId, chucvu_id } = route.params;
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhongBan, setSelectedPhongBan] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [phongBanList, setPhongBanList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  // Move fetchData outside useFocusEffect
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const data = await locTheoPhongBan(phongbanId,chucvu_id);
      if (data && typeof data === 'object') {
        const employeeArray = Object.keys(data).map((key) => ({
          ...data[key],
          manv: data[key].employeeId,
        }));
        setEmployeeData(employeeArray);
        setFilteredData(employeeArray);
      } else {
        console.warn('Dữ liệu nhân viên không hợp lệ:', data);
      }

      const phongBans = await readPhongBanFromRealtime();
      if (phongBans) {
        setPhongBanList(phongBans);
      } else {
        console.warn('Dữ liệu phòng ban không hợp lệ:', phongBans);
      }
    } catch (error) {
      console.log('Lỗi khi fetching dữ liệu:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Call fetchData when the screen is focused
    }, [])
  );

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
    navigation.navigate('EmployeeDetail', { manv: item.manv, key: "inf" });
  };

  const handleAddEmployee = () => {
    navigation.navigate('AddEmployee');
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setFilteredData(employeeData);
    } else {
      const searchResults = await searchEmployeesByNameOrId(searchTerm);
      const employeeArray = Object.keys(searchResults).map((key) => ({
        ...searchResults[key],
        manv: key,
      }));
      setFilteredData(employeeArray);
    }
  };

  const onRefresh = async () => {
    await fetchData(); // Call fetchData on refresh
  };

  return (
    <>
      <BackNav
        navigation={navigation}
        name="Danh sách nhân viên"
        soLuong={filteredData.length}
        btn="Add"
        onEditPress={handleAddEmployee}
      />
      <View style={styles.container}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên hoặc mã nhân viên"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Tìm kiếm</Text>
          </TouchableOpacity>
        </View>
  
        {/* Filter Section */}
        <View style={styles.filterWrapper}>
          {/* Spinner Phòng Ban - Hiển thị chỉ khi chucvu_id là GD */}
          {chucvu_id === 'GD' && (
            <View style={styles.filterSection}>
              <RNPickerSelect
                onValueChange={(itemValue) => setSelectedPhongBan(itemValue)}
                items={phongBanList.map((phongBan) => ({
                  label: phongBan.tenPhongBan,
                  value: phongBan.maPhongBan,
                }))}
                value={selectedPhongBan}
                placeholder={{ label: 'Phòng ban', value: '' }}
                style={pickerSelectStyles}
              />
            </View>
          )}
  
          {/* Spinner Giới tính */}
          <View style={styles.filterSection}>
            <RNPickerSelect
              onValueChange={(itemValue) => setSelectedGender(itemValue)}
              items={[
                { label: 'Nam', value: 'Nam' },
                { label: 'Nữ', value: 'Nữ' },
              ]}
              value={selectedGender}
              placeholder={{ label: 'Giới tính', value: '' }}
              style={pickerSelectStyles}
            />
          </View>
  
          {/* Spinner Trạng thái */}
          <View style={styles.filterSection}>
            <RNPickerSelect
              onValueChange={(itemValue) => setSelectedStatus(itemValue)}
              items={[
                { label: 'Đang làm', value: 'true' },
                { label: 'Đã nghỉ', value: 'false' },
              ]}
              value={selectedStatus}
              placeholder={{ label: 'Trạng thái', value: '' }}
              style={pickerSelectStyles}
            />
          </View>
        </View>
  
        {/* Employee List */}
        <FlatList
          style={styles.employeeList}
          data={filteredData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <ItemListEmployee manv={item.manv} name={item.name} imageUrl={item.imageUrl} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.manv}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
  
}

const pickerSelectStyles = {
  inputIOS: {
    height: 40,
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  inputAndroid: {
    height: 40,
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  placeholder: {
    color: '#a0a0a0',
  },
};


const styles = StyleSheet.create({
  container: {
    flex: 13,
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
    backgroundColor: '#fff',
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
  },
  filterSection: {
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  employeeList: {
    marginTop: 10,
    paddingBottom: 20,
  },
});
