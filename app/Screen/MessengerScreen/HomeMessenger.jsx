import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getEmployeeById, readEmployeesFireStore } from '../../services/EmployeeFireBase';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../config/firebaseconfig';

export default function HomeMessenger({ navigation, route }) {
  const [visibleModal, setVisibleModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { employee } = route.params;
  const [chatList, setChatList] = useState([]);


  const CheckStatusSend = (employeePatenerId, lastSendId, statusSend) => {
    console.log("666" + employee.employeeId)
    if (employee.employeeId == lastSendId) {
      return true;
    } else {
      if (statusSend == "0") {
        return false;
      }
      return true;
    }
  }

  const fetchData = async () => {
    try {
      const dataEmp = await readEmployeesFireStore();
      const dataEmpArray = Object.keys(dataEmp).map((key) => ({
        ...dataEmp[key],
        employeeID: dataEmp[key].employeeId,
      }));

      setEmployeeData(dataEmpArray);

      // Listen to real-time changes in chat list
      listenToChatList(employee.employeeId);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Function to listen to the chat list in real-time
  const listenToChatList = (employeeID) => {
    const chatsRef = ref(database, 'chats');
    onValue(chatsRef, (snapshot) => {
      const chatList = [];
      snapshot.forEach((childSnapshot) => {
        const chat = childSnapshot.val();
        if (chat.participants && chat.participants.includes(employeeID)) {
          chatList.push({ id: childSnapshot.key, ...chat });
        }
      });
      setChatList(chatList);
    });
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handleChatItemPress = async (id) => {
    const empToId = id.replace('_', '').replace(employee.employeeId, '');
    const employeeTo = await getEmployeeById(empToId);
  
    // Cập nhật trạng thái "Đã đọc" trong Firebase
    const chatRef = ref(database, `chats/${id}`);
    await update(chatRef, {
      status: '1', // 1 = Đã đọc
    });
  
    // Điều hướng đến màn hình chi tiết trò chuyện
    navigation.navigate('MesengerDetails', { empFrom: employee, empTo: employeeTo });
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messenger</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setVisibleModal(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Danh sách các cuộc trò chuyện */}
      <FlatList
        style={styles.chatList}
        data={chatList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleChatItemPress(item.id)}
          >
            <View style={styles.chatItemContent}>
              <View>
                <Text style={styles.participantsText}>
                  {item.participants.join('').replace(employee.employeeId, '')}
                </Text>
              </View>
              <View style={styles.statusContainer}>
                <Text style={[
                  styles.statusText,
                  { color: CheckStatusSend(item.participants.join('').replace(employee.employeeId, ''), item.lastSend, item.status) ? 'green' : 'red' }
                ]}>
                  {CheckStatusSend(item.participants.join('').replace(employee.employeeId, ''), item.lastSend, item.status) ? 'Đã đọc' : 'Chưa đọc'}
                </Text>
              </View>
            </View>
            <Text style={styles.lastMessageText}>{item.lastMessage}</Text>
            <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

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
  chatItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
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
  chatList: {
    flex: 1,
  },
  chatItem: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  participantsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessageText: {
    fontSize: 15,
    color: 'blue',
    marginTop: 5,
  },
  timestampText: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
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
