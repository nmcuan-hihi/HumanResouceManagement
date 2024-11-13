import {
  getDatabase,
  ref,
  get,
} from "firebase/database";
import { app } from "../config/firebaseconfig";

const database = getDatabase(app);

// Function to get department (phong ban) by ID from Realtime Database
export const getPhongBanById = async (phongBanId) => {
  try {
    const phongBanRef = ref(database, `phongban/${phongBanId}`); // Reference to phongban by ID
    const snapshot = await get(phongBanRef); // Fetch data from Realtime Database

    if (snapshot.exists()) {
      const phongban = snapshot.val(); // Convert data to object
      return phongban; // Return phongban data
    } else {
      console.log(`Không tìm thấy dữ liệu cho phòng ban ID: ${phongBanId}`);
      return null; // No phongban data found
    }
  } catch (error) {
    console.error("Lỗi khi đọc thông tin phòng ban:", error);
  }
};
