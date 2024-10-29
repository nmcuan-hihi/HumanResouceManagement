import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import { firestore } from '../config/firebaseconfig';

import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  setDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage



export const getPhongBanById = async (phongBanId) => {
  try {
    const phongBanRef = doc(firestore, `phongban/${phongBanId}`); // Tham chiếu tới phòng ban theo ID
    const snapshot = await getDoc(phongBanRef); // Lấy dữ liệu từ document

    if (snapshot.exists()) {
      const phongban = snapshot.data(); // Lấy dữ liệu và chuyển đổi thành đối tượng
      return phongban; // Trả về thông tin phòng ban
    } else {
      console.log(`Không tìm thấy dữ liệu cho phòng ban ID: ${phongBanId}`);
      return null; // Không tìm thấy phòng ban
    }
  } catch (error) {
    console.error("Lỗi khi đọc thông tin phòng ban:", error);
  }
};