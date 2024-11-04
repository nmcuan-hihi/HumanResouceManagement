import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, RefreshControl } from 'react-native';
import BackNav from '../../Compoment/BackNav';
import { readChucVu } from '../../services/database';
import ItemListEmployee from '../../Compoment/ItemEmployee';
import { useFocusEffect } from '@react-navigation/native';

export default function ListChucVu({ navigation }) {
  const [chucVuData, setChucVuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // State to manage refresh control

  const handleOtherButtonPress = () => {
    navigation.navigate("AddChucVu");
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null); // Reset error state

    try {
      const data = await readChucVu();
      if (data) {
        const chucVuArray = Object.keys(data).map(key => ({
          ...data[key],
          id: key,
        }));
        setChucVuData(chucVuArray);
      } else {
        setChucVuData([]); // No data
      }
    } catch (error) {
      setError('Failed to load data. Please try again.'); // Set error message
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData(); // Fetch data when the screen is focused
    }, [])
  );

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true
    await fetchData(); // Fetch data
    setRefreshing(false); // Reset refreshing state
  };

  const handleDelete = (id) => {
    // Logic to delete the item from Firestore
    // Assuming you have a function to delete the item
    deleteChucVu(id)
      .then(() => {
        fetchData(); // Refresh the data after successful deletion
      })
      .catch(error => {
        console.error("Error deleting item:", error);
      });
  };

  if (isLoading) {
    return <Text>Loading...</Text>; // Show loading indicator
  }

  if (error) {
    return <Text>{error}</Text>; // Show error message
  }

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
            onPress={() => navigation.navigate("ChucVuDetail", { 
              chucVuId: item.id, 
              chucvu_id: item.chucvu_id,
              onDelete: handleDelete // Pass the delete handler
            })}
          >
            <ItemListEmployee manv={item.loaichucvu} name={item.hschucvu} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

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
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
