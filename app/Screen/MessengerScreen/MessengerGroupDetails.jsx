import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { sendMessage } from '../../services/MessengerDB';
import BackNav from '../../Compoment/BackNav';
import { database } from '../../config/firebaseconfig';
import { ref, get, set, onValue } from 'firebase/database';
import moment from 'moment';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { store } from '../../redux/store';
import { readEmployeesFireStore } from '../../services/EmployeeFireBase';

export default function MessengerGroupDetails({ navigation, route }) {
  const { empFrom, chatID, KeyID } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const [employeeData, setEmployeeData] = useState([]);
  // Lấy idCty từ store
  const state = store.getState();
  const idCty = state.congTy.idCty;

  // Hàm lấy tin nhắn hoặc tạo cuộc trò chuyện mới
  const getMessenger = async () => {
    const chatRef = ref(database, `${idCty}/chats/${chatID}`);
    const messagesRef = ref(database, `${idCty}/messages/${chatID}`);

    try {
      const chatSnapshot = await get(chatRef);
      if (chatSnapshot.exists()) {
        const messagesSnapshot = await get(messagesRef);
        const messages = [];
        messagesSnapshot.forEach(childSnapshot => {
          messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return messages;
      } else {
        // Tạo mới cuộc trò chuyện
        await set(chatRef, {
          participants: "ALL",
          lastMessage: 'Start Chat!',
          timestamp: Date.now(),
          status: false,
          lastSend: empFrom.employeeId,
        });
        return [];
      }
    } catch (error) {
      console.log('Lỗi khi lấy hoặc tạo cuộc trò chuyện:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataEmp = await readEmployeesFireStore();
        const dataEmpArray = Object.keys(dataEmp).map((key) => ({
          ...dataEmp[key],
          employeeID: dataEmp[key].employeeId,
        }));
        setEmployeeData(dataEmpArray);
        
        const initialMessages = await getMessenger();
        setMessages(initialMessages);
  
        // Lắng nghe dữ liệu theo thời gian thực
        const messagesRef = ref(database, `${idCty}/messages/${chatID}`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const messageList = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setMessages(messageList);
          } else {
            setMessages([]);
          }
        });
  
        return () => unsubscribe();
      } catch (error) {
        console.log('Lỗi khi lấy dữ liệu:', error);
      }
    };
  
    fetchData(); // Gọi hàm async bên trong useEffect
  }, []);

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(chatID, empFrom.employeeId, newMessage);
        setNewMessage('');
      } catch (error) {
        console.log('Lỗi khi gửi tin nhắn:', error);
      }
    }
  };

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {
        KeyID == "COM" ? ( <BackNav name="Chat Công Ty" />):( <BackNav name="Chat Phòng Ban" />)
      }
      <View style={{ flex: 15 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => 
          {
            const employee = employeeData.find(emp => emp.employeeID === item.sender);
          return  ( <View
              style={[
                styles.messageItem,
                item.sender === empFrom.employeeId ? styles.messageFrom : styles.messageTo,
              ]}
            >
              <Text style={styles.nameText}>{employee?.name}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>{moment(item.timestamp).format('HH:mm DD/MM')}</Text>
            </View>
          )}
        }
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <FontAwesome name="send-o" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  messageItem: {
    maxWidth: '70%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  messageFrom: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  messageTo: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
  },
  nameText: {
    fontSize: 10,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    alignItems: "center",
    width: "17%",
    marginLeft: 10,
    backgroundColor: '#1E88E5',
    borderRadius: 5,
    padding: 10,
  },
});
