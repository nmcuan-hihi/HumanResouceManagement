import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { sendMessage, generateChatID } from '../../services/MessengerDB';
import BackNav from '../../Compoment/BackNav';
import { database } from '../../config/firebaseconfig';
import { ref, get, set, onValue } from 'firebase/database';
import moment from 'moment';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MesengerDetails({ navigation, route }) {
  const { empFrom, empTo } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const chatID = generateChatID(empFrom.employeeId, empTo.employeeId);

  const getMessenger = async (id1, id2) => {
    const chatID = generateChatID(id1, id2);
    const chatRef = ref(database, `chats/${chatID}`);
    const messagesRef = ref(database, `messages/${chatID}`);

    try {
      const chatSnapshot = await get(chatRef);
      if (chatSnapshot.exists()) {
        const messagesSnapshot = await get(messagesRef);
        const messages = [];
        messagesSnapshot.forEach(childSnapshot => {
          messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return { chatID, messages };
      } else {
        await set(chatRef, {
          participants: [id1, id2],
          lastMessage: '',
          timestamp: Date.now(),
          status: false,
          lastSend: id1,
        });
        return { chatID, messages: [] };
      }
    } catch (error) {
      console.error('Lỗi khi lấy hoặc tạo cuộc trò chuyện:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { messages } = await getMessenger(empFrom.employeeId, empTo.employeeId);
        setMessages(messages);

        const messagesRef = ref(database, 'messages/' + chatID);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const messageList = Object.keys(data).map((key) => ({
              id: key,
              sender: data[key].sender,
              text: data[key].text,
              timestamp: data[key].timestamp,
            }));
            setMessages(messageList);
          } else {
            setMessages([]);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(chatID, empFrom.employeeId, newMessage);
        setNewMessage('');
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
      }
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <BackNav name={empTo.name} />
      <View style={{ flex: 14 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.timestamp}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageItem,
                item.sender === empFrom.employeeId ? styles.messageFrom : styles.messageTo,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>{moment(item.timestamp).format('HH:mm DD/MM')}</Text>
            </View>
          )}
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
    flex: 15,
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
  timestamp: {
    fontSize: 8,
    color: '#888',
    alignSelf: 'flex-end',
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
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
