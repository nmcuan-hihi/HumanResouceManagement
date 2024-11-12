// app/services/MessengerDB.js
import { database } from '../config/firebaseconfig';
import { ref, push, set, get, update } from 'firebase/database';

// Hàm tạo ID cuộc trò chuyện duy nhất
export const generateChatID = (id1, id2) => {
  return [id1, id2].sort().join('_');
};

// Hàm lấy hoặc tạo cuộc trò chuyện giữa hai nhân viên
export const getMessenger = async (id1, id2) => {
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

// Hàm gửi tin nhắn
export const sendMessage = async (chatID, senderID, text) => {
  const messageID = push(ref(database, `messages/${chatID}`)).key;
  const messageData = {
    sender: senderID,
    text: text,
    timestamp: Date.now()
  };

  const updates = {};
  updates[`/messages/${chatID}/${messageID}`] = messageData;
  updates[`/chats/${chatID}/lastMessage`] = text;
  updates[`/chats/${chatID}/timestamp`] = Date.now();

  try {
    await update(ref(database), updates);
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error);
    throw error;
  }
};
// Hàm lấy danh sách các cuộc trò chuyện của một nhân viên
export const getChatList = async (employeeID) => {
    const chatsRef = ref(database, 'chats');
    try {
      const chatsSnapshot = await get(chatsRef);
      const chatList = [];
      chatsSnapshot.forEach(childSnapshot => {
        const chat = childSnapshot.val();
       
        if (chat.participants.includes(employeeID)) {
          chatList.push({ id: childSnapshot.key, ...chat });
          console.log("_______-"+ chat.participants)

        }
      });

      return chatList;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error);
      throw error;
    }
  };