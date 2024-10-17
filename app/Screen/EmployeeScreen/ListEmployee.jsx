import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import ItemListEmployee from '../../Compoment/ItemEmployee';
import BackNav from '../../Compoment/BackNav';

const employeeData = [
  { manv: "NV001", name: "Nguyễn Minh Quân" },
  { manv: "NV002", name: "Nguyễn Văn B" },
  { manv: "NV003", name: "Trần Thị C" },
  { manv: "NV001", name: "Nguyễn Minh Quân" },
  { manv: "NV002", name: "Nguyễn Văn B" },
  { manv: "NV003", name: "Trần Thị C" },
  { manv: "NV001", name: "Nguyễn Minh Quân" },
  { manv: "NV002", name: "Nguyễn Văn B" },
  { manv: "NV003", name: "Trần Thị C" },
  { manv: "NV001", name: "Nguyễn Minh Quân" },
  { manv: "NV002", name: "Nguyễn Văn B" },
  { manv: "NV003", name: "Trần Thị C" },
  { manv: "NV001", name: "Nguyễn Minh Quân" },
  { manv: "NV002", name: "Nguyễn Văn B" },
  { manv: "NV003", name: "Trần Thị C" },
  // Thêm nhiều nhân viên khác vào đây
];

export default function EmployeeList({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <BackNav navigation={navigation} name={"Danh sách nhân viên"}  />
        {/* <Text style={styles.headerText}>{"120"}</Text> */}
      </View>

      {/* Employee List */}
      <FlatList
        style={{ marginTop: 20 }} // Adjust margin as needed
        data={employeeData}
        renderItem={({ item }) => (
          <ItemListEmployee manv={item.manv} name={item.name} />
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
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Add space between BackNav and number text
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 24, // Font size for "120"
    fontWeight: 'bold',
    color: '#000000', // Black color
    marginRight: 100, // Optional: Add margin to space from BackNav
  },
});
