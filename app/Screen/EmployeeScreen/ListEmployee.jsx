import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import ItemListEmployee from '../../Compoment/ItemEmployee';
import BackNav from '../../Compoment/BackNav';
import { readEmployees, readPhongBan1 } from '../../services/database';
import { filterEmployeesByPhongBan, filterEmployeesByGender, filterEmployeesByStatus, searchEmployeesByNameOrId } from '../../services/PhongBanDatabase';

export default function EmployeeList({ navigation }) {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhongBan, setSelectedPhongBan] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [phongBanList, setPhongBanList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await readEmployees();
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

        const phongBans = await readPhongBan1();
        if (phongBans) {
          setPhongBanList(phongBans);
        } else {
          console.warn('Dữ liệu phòng ban không hợp lệ:', phongBans);
        }
      } catch (error) {
        console.error('Lỗi khi fetching dữ liệu:', error);
      }
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
        const statusToCompare = selectedStatus === 'true' ? 'true' : 'false';
        filteredResults = await filterEmployeesByStatus(statusToCompare);
      }

      setFilteredData(filteredResults);
    };

    applyFilters();
  }, [selectedPhongBan, selectedGender, selectedStatus, employeeData]);

  const handlePress = (item) => {
    navigation.navigate('EmployeeDetail', { manv: item.manv, key : "inf" });
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
        />
      </View>
    </>
  );
}

const pickerSelectStyles = {
  inputIOS: {
    height: 27,
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    fontSize: 16,
  },
  inputAndroid: {
    height: 27,
    color: 'black',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    fontSize: 16,
  },
  placeholder: {
    color: '#a0a0a0',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 13,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 15,
    height: 40,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  filterWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterSection: {
    borderWidth: 1,
    borderColor: "blue",
    flex: 1,
    marginHorizontal: 5,
  },
  employeeList: {
    marginTop: 10,
  },
});
