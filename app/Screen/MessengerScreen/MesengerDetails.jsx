import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getMessenger, sendMessage, generateChatID } from '../../services/MessengerDB'; // Đảm bảo đường dẫn đúng
import BackNav from '../../Compoment/BackNav';

export default function MesengerDetails({ navigation, route }) {
  const { empFrom, empTo } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatID = generateChatID(empFrom.employeeId, empTo.employeeId);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { messages } = await getMessenger(empFrom.employeeId, empTo.employeeId);
        setMessages(messages);
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
        // Fetch messages again to update the list
        const { messages } = await getMessenger(empFrom.employeeId, empTo.employeeId);
        setMessages(messages);
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
        <BackNav name={empTo.name}/>
      <Text style={styles.header}>Chat between {empFrom.name} and {empTo.name}</Text>
      <FlatList
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 15,
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
