import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { readEmployeesFireStore } from '../../services/EmployeeFireBase'; 
import { getChatList } from '../../services/MessengerDB';

export default function HomeMessenger({ navigation, route }) {
  const [visibleModal, setVisibleModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { employee } = route.params;
  const [chatList, setChatList] = useState([]);
  const fetchData = async () => {
    try {
      const dataEmp = await readEmployeesFireStore();
      const dataChat = await getChatList(employee.employeeId)
      const dataEmpArray = Object.keys(dataEmp).map((key) => ({
        ...dataEmp[key],
        employeeID: dataEmp[key].employeeId,
      }));

      setEmployeeData(dataEmpArray);
      setChatList(dataChat);
    
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setVisibleModal(false);
    navigation.navigate('MesengerDetails', { empFrom: route.params.employee, empTo: employee });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messenger</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setVisibleModal(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Nội dung chính của màn hình */}
      <View style={styles.content}>
        <Text style={styles.contentText}>HomeMessenger</Text>
      </View>

      {/* Modal for adding a new chat */}
      <Modal visible={visibleModal} transparent={true} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalCtn}>
          <View style={styles.bodyModal}>
            <View style={styles.headerModal}>
              <Text style={styles.modalTitle}>Add Chat</Text>
              <TouchableOpacity onPress={() => setVisibleModal(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search employees"
                value={searchText}
                onChangeText={setSearchText}
              />
              <FlatList
                style={styles.employeeList}
                data={employeeData.filter(
                  (item) =>
                    item.name && item.name.toLowerCase().includes(searchText.toLowerCase())
                )}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.employeeItem}
                    onPress={() => handleSelectEmployee(item)}
                  >
                    <Text>{`${item.employeeID} - ${item.name}`}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.employeeID}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 50,
    padding: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 18,
    color: '#333',
  },
  modalCtn: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyModal: {
    width: '85%',
    height: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  employeeList: {
    flex: 1,
    marginBottom: 10,
  },
  employeeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
