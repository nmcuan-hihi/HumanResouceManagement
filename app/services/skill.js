
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
import { firestore } from "../config/firebaseconfig";

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
  deleteDoc,
} from "firebase/firestore";
const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage

export const addSkill = async (skill) => {
  const skillId = skill.mask; // Sử dụng mask làm ID
  try {
    await setDoc(doc(firestore, `skills/${skillId}`), skill); // Thêm kỹ năng vào Firestore
    console.log(`Skill ${skillId} added successfully!`);
  } catch (error) {
    console.error(`Error adding skill ${skillId}:`, error);
  }
};

export const updateSkill = async (mask, updatedData) => {
  try {
    const skillRef = doc(firestore, `skills/${mask}`); // Tham chiếu đến kỹ năng theo mask
    await updateDoc(skillRef, updatedData); // Cập nhật kỹ năng
    console.log(`Skill ${mask} updated successfully!`);
  } catch (error) {
    console.error(`Error updating skill ${mask}:`, error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

export const deleteSkill = async (mask) => {
  try {
    const skillRef = doc(firestore, `skills/${mask}`); // Tham chiếu đến kỹ năng theo mask
    await deleteDoc(skillRef); // Xóa kỹ năng
    console.log(`Skill ${mask} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting skill ${mask}:`, error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

export const readSkills = async () => {
  try {
    const skillsRef = collection(firestore, "skills"); // Tham chiếu đến collection 'skills'
    const snapshot = await getDocs(skillsRef); // Lấy dữ liệu từ collection

    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => ({
        mask: doc.id, // Mã kỹ năng
        tensk: doc.data().tensk, // Tên kỹ năng
      }));
    } else {
      console.log("No skills available");
      return [];
    }
  } catch (error) {
    console.error("Error reading skills:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};

// Hàm để đọc thông tin của một kỹ năng cụ thể từ Firebase bằng mask

export const readSkill1 = async (mask) => {
  try {
    const skillRef = doc(firestore, `skills/${mask}`); // Tham chiếu đến kỹ năng theo mask
    const snapshot = await getDoc(skillRef); // Lấy dữ liệu từ Firestore

    if (snapshot.exists()) {
      const skillData = snapshot.data(); // Lấy dữ liệu kỹ năng
      return { mask, tensk: skillData.tensk }; // Giả sử 'tensk' là tên kỹ năng trong dữ liệu
    } else {
      console.log("Kỹ năng không tồn tại");
      return null; // Nếu không tìm thấy kỹ năng, trả về null
    }
  } catch (error) {
    console.error("Lỗi khi đọc kỹ năng:", error);
    return null; // Nếu có lỗi, trả về null
  }
};
