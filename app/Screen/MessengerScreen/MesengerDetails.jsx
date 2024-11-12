import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { sendMessage, generateChatID } from '../../services/MessengerDB'; // Đảm bảo đường dẫn đúng
import BackNav from '../../Compoment/BackNav';
import { database } from '../../config/firebaseconfig'; // Đảm bảo đường dẫn đúng
import { ref, get, set, onValue } from 'firebase/database'; // Lấy các hàm của Firebase Realtime Database

export default function MesengerDetails({ navigation, route }) {
  const { empFrom, empTo } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatID = generateChatID(empFrom.employeeId, empTo.employeeId);

  const flatListRef = useRef(null); // Sử dụng ref để tham chiếu tới FlatList

  // Hàm lấy hoặc tạo cuộc trò chuyện
  const getMessenger = async (id1, id2) => {
    const chatID = generateChatID(id1, id2);
    const chatRef = ref(database, `chats/${chatID}`);
    const messagesRef = ref(database, `messages/${chatID}`);

    try {
      // Kiểm tra xem cuộc trò chuyện có tồn tại không
      const chatSnapshot = await get(chatRef);
      if (chatSnapshot.exists()) {
        // Cuộc trò chuyện tồn tại, lấy tin nhắn
        const messagesSnapshot = await get(messagesRef);
        const messages = [];
        messagesSnapshot.forEach(childSnapshot => {
          messages.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        return { chatID, messages };
      } else {
        // Cuộc trò chuyện không tồn tại, tạo cuộc trò chuyện mới
        await set(chatRef, {
          participants: [id1, id2],
          lastMessage: '',
          timestamp: Date.now()
        });
        return { chatID, messages: [] };
      }
    } catch (error) {
      console.error('Lỗi khi lấy hoặc tạo cuộc trò chuyện:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Lấy tin nhắn và tạo cuộc trò chuyện nếu cần
    const fetchMessages = async () => {
      try {
        const { messages } = await getMessenger(empFrom.employeeId, empTo.employeeId);
        setMessages(messages);

        // Lắng nghe thay đổi tin nhắn trong thời gian thực
        const messagesRef = ref(database, 'messages/' + chatID);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const messageList = Object.keys(data).map((key) => ({
              id: key,
              sender: data[key].sender,
              text: data[key].text,
            }));
            setMessages(messageList);
          } else {
            setMessages([]);
          }
        });

        // Dọn dẹp khi component bị unmount
        return () => unsubscribe();
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error);
      }
    };

    fetchMessages();
  }, []);

  // Hàm gửi tin nhắn
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

  // Đảm bảo rằng khi tin nhắn mới được thêm vào, màn hình sẽ cuộn xuống cuối
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]); // Khi messages thay đổi, sẽ gọi scrollToEnd

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BackNav name={empTo.name} />
      <Text style={styles.header}>Chat between {empFrom.name} and {empTo.name}</Text>
      <FlatList
        ref={flatListRef} // Gắn ref cho FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text>{item.sender === empFrom.employeeId ? empFrom.name : empTo.name}: {item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
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
