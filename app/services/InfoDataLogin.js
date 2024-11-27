import {
  getDatabase,
  ref,
  get,
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import { store } from "../redux/store"; // Import Redux store to access idCty
const database = getDatabase(app);

// Function to get department (phong ban) by ID from Realtime Database
export const getPhongBanById = async (phongBanId) => {
  try {
    // Lấy idCty từ store
const state = store.getState();
const idCty = state.congTy.idCty;
    const phongBanRef = ref(database, `${idCty}/phongban/${phongBanId}`); // Reference to phongban by ID
    const snapshot = await get(phongBanRef); // Fetch data from Realtime Database

    if (snapshot.exists()) {
      const phongban = snapshot.val(); // Convert data to object
      return phongban; // Return phongban data
    } else {
      console.log(`Không tìm thấy dữ liệu cho phòng ban ID: ${phongBanId}`);
      return null; // No phongban data found
    }
  } catch (error) {
    console.log("Lỗi khi đọc thông tin phòng ban:", error);
  }
};
