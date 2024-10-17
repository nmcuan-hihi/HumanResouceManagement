import { View, Text, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import BackNav from '../../Compoment/BackNav';
import ItemListEmployee from '../../Compoment/ItemEmployee';

export default function PhongBanScreen(navigation) {
    const employeeData = [
        { manv: "IT01", name: "Phòng IT01" },
        { manv: "IT02", name: "Phòng IT02" },
        { manv: "IT03", name: "Phòng IT03" },
        { manv: "KT01", name: "Phòng kế toán 1" },
        { manv: "KT02", name: "Phòng kế toán 2" },
        { manv: "KT03", name: "Phòng kế toán 3" },
        { manv: "NS01", name: "Phòng nhân sự 1" },
        { manv: "NS02", name: "Phòng nhân sự 2" },
        { manv: "NS03", name: "Phòng nhân sự 3" },
      
        // Thêm nhiều nhân viên khác vào đây
      ];
    return (
        <><BackNav navigation={navigation} name={"Phòng ban"} btn={"10"} />
        <View style={styles.container}>


            <FlatList
                style={{ marginTop: 20 }} // Adjust margin as needed
                data={employeeData}
                renderItem={({ item }) => (
                    <ItemListEmployee manv={item.manv} name={item.name} />
                )}
                keyExtractor={(item, index) => index.toString()} // Use index as a key
            />
        </View></>

    );

} 
const styles = StyleSheet.create({
    container: {
      flex: 9,
      backgroundColor: '#f8f8f8',
     
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