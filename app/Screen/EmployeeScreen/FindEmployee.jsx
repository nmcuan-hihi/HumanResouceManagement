import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import ItemListEmployee from '../../Compoment/ItemEmployee';
import BackNav from '../../Compoment/BackNav';

const employeeData = [
  { manv: "NV001", name: "Nguyễn Minh Quân" },
  { manv: "NV002", name: "Nguyễn Văn B" },
  { manv: "NV003", name: "Trần Thị C" },
  // Thêm nhiều nhân viên khác vào đây
];

export default function FindEmployee({ navigation }) {
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredData, setFilteredData] = useState(employeeData); // State for filtered employees
  const [searchBy, setSearchBy] = useState('name'); // State for search criteria (name or manv)

  // Handle search logic
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const newData = employeeData.filter(item => {
        const itemData = searchBy === 'name' ? item.name.toUpperCase() : item.manv.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.includes(textData);
      });
      setFilteredData(newData);
    } else {
      setFilteredData(employeeData);
    }
  };

  const handlePress = (item) => {
    navigation.navigate('EmployeeDetail', { manv: item.manv, name: item.name });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <BackNav navigation={navigation} name={"Tìm kiếm nhân viên"} />
      </View>

      {/* Search Filter Combobox */}
      <Picker
        selectedValue={searchBy}
        style={styles.picker}
        onValueChange={(itemValue) => setSearchBy(itemValue)}
      >
        <Picker.Item label="Tìm kiếm theo tên" value="name" />
        <Picker.Item label="Tìm kiếm theo mã nhân viên" value="manv" />
      </Picker>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder={`Tìm kiếm theo ${searchBy === 'name' ? 'tên' : 'mã nhân viên'}...`}
        value={searchQuery}
        onChangeText={text => handleSearch(text)}
      />

      {/* Employee List */}
      <FlatList
        style={{ marginTop: 20 }} // Adjust margin as needed
        data={filteredData} // Use filtered data
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <ItemListEmployee manv={item.manv} name={item.name} />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()} // Use index as a key
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
  picker: {
    height: 50,
    marginHorizontal: 15,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    backgroundColor: '#fff',
  },
});
