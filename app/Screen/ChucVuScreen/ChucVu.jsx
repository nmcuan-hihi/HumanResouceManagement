import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BackNav from '../../Compoment/BackNav';
import { readChucVu } from '../../services/database';
import ItemListEmployee from '../../Compoment/ItemEmployee';

export default function ListChucVu({ navigation }) {
  const [chucVuData, setChucVuData] = useState([]);

  // const handleAddChucVu = () => {
  //   navigation.navigate("AddChucVu"); // Điều hướng đến màn hình AddChucVu
  // };

  const handleOtherButtonPress = () => {
    navigation.navigate("AddChucVu")
   
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await readChucVu();
      if (data) {
        const chucVuArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
        }));
        setChucVuData(chucVuArray);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <BackNav 
          navigation={navigation} 
          name={"Danh sách chức vụ"} 
          soLuong={chucVuData.length} 
          btn={"Add"}
          onEditPress={handleOtherButtonPress}
        />
        
      
      </View>

      <FlatList
        style={{ marginTop: 20 }}
        data={chucVuData}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemContainer} 
            onPress={() => navigation.navigate("ChucVuDetail", { chucVuId: item.id,chucvu_id: item.chucvu_id})}
          >
            <ItemListEmployee manv={item.loaichucvu} name={item.hschucvu} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
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

    paddingBottom: 10,
  },
  otherButton: {
    padding: 17,
    margin:2,
    backgroundColor: '#007BFF', // Màu nền của nút
    borderRadius: 5,
  },
  otherButtonText: {
    color: '#FFFFFF', // Màu chữ
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
