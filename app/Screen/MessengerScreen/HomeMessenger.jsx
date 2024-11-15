import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList, KeyboardAvoidingView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { getEmployeeById, readEmployeesFireStore } from '../../services/EmployeeFireBase';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../config/firebaseconfig';
import { readPhongBanFromRealtime } from '../../services/PhongBanDatabase';

export default function HomeMessenger({ navigation, route }) {
  const [visibleModal, setVisibleModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);  // Loading state
  const { employee } = route.params;
  const [chatList, setChatList] = useState([]);

  const [phongbans, setPhongBan] = useState([]);
  const CheckStatusSend = (employeePatenerId, lastSendId, statusSend) => {
    if (employee.employeeId == lastSendId) {
      return true;
    } else {
      return statusSend !== "0";
    }
  };

  const fetchData = async () => {
    setLoading(true);  // Show loading indicator
    try {
      const dataEmp = await readEmployeesFireStore();
      const dataPB = await readPhongBanFromRealtime();

      const dataEmpArray = Object.keys(dataEmp).map((key) => ({
        ...dataEmp[key],
        employeeID: dataEmp[key].employeeId,
      }));

      setEmployeeData(dataEmpArray);
      setPhongBan(dataPB);

      // Listen to real-time changes in chat list
      listenToChatList(employee.employeeId);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

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
    setLoading(true);
    await fetchData();
    setLoading(false);
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

  const handleChatItemPress = async (id, lastSend) => {
    const empToId = id.replace('_', '').replace(employee.employeeId, '');
    const employeeTo = await getEmployeeById(empToId);

    if (empToId == lastSend) {
      const chatRef = ref(database, `chats/${id}`);
      await update(chatRef, {
        status: '1', // 1 = Đã đọc
      });
    }

    navigation.navigate('MesengerDetails', { empFrom: employee, empTo: employeeTo });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messenger</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setVisibleModal(true)}>
          <FontAwesome5 name="facebook-messenger" size={24} color="blue" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          style={styles.chatList}
          data={chatList}
          renderItem={({ item }) => {
            const otherParticipantId = item.participants.find(participant => participant !== employee.employeeId);
            const employeePatener = employeeData.find(emp => emp.employeeID === otherParticipantId);
            return (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handleChatItemPress(item.id, item.lastSend)}
              >
                <View style={styles.chatItemContent}>
                  <Text style={styles.participantsText}>
                    {employeePatener?.name}
                  </Text>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: CheckStatusSend(
                          otherParticipantId,
                          item.lastSend,
                          item.status
                        )
                          ? 'green'
                          : 'red'
                      }
                    ]}
                  >
                    {CheckStatusSend(otherParticipantId, item.lastSend, item.status) ? 'Đã đọc' : 'Chưa đọc'}
                  </Text>
                </View>
                <Text style={styles.lastMessageText}>
                  {item.lastMessage.length > 30 ? item.lastMessage.substring(0, 50) + "..." : item.lastMessage}
                </Text>

                <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        />
      )}

      <Modal visible={visibleModal} transparent={true} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalCtn}>
          <View style={styles.bodyModal}>
            <View style={styles.headerModal}>
              <Text style={styles.modalTitle}>{employee.chucvuId == "GD" ? "Chat Với Nhân Viên" : "Chat Với Đồng Nghiệp"}</Text>
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
                data={employeeData.filter(item =>
                  item.name && item.name.toLowerCase().includes(searchText.toLowerCase())
                )}
                renderItem={({ item }) => {

                  const phongBanName = phongbans.find(key => item.phongbanId == key.maPhongBan);
                  if (employee.chucvuId == "GD") {
                    if (item.employeeId != employee.employeeId) {
                      return (
                        <TouchableOpacity style={styles.employeeItem} onPress={() => handleSelectEmployee(item)}>
                          <Text>{`${phongBanName ? phongBanName.tenPhongBan : 'Chưa có'} - ${item.name}`}</Text>
                        </TouchableOpacity>
                      );
                    }
                  }
                  else {
                    if (item.phongbanId == employee.phongbanId && item.employeeId != employee.employeeId) {
                      return (
                        <TouchableOpacity style={styles.employeeItem} onPress={() => handleSelectEmployee(item)}>
                          <Text>{`${phongBanName ? phongBanName.tenPhongBan : 'Chưa có'} - ${item.name}`}</Text>
                        </TouchableOpacity>
                      );
                    }
                  }


                }}
                keyExtractor={(item) => item.employeeID}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'blue',
    fontWeight: 'bold',
  },
  addButton: {
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
  chatItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  lastMessageText: {
    fontSize: 15,
    color: 'blue',
    marginTop: 5,
  },
  timestampText: {
    alignSelf: 'flex-end',
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
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  employeeList: {
    flex: 1,
    marginBottom: 10,
  },
  employeeItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
