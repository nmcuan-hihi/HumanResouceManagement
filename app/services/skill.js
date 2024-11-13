import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
  remove,
  push
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import { getStorage } from "firebase/storage";

const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage

// Thêm kỹ năng
export const addSkill = async (skill) => {
  const skillId = skill.mask; // Sử dụng mask làm ID
  try {
    await set(ref(database, `skills/${skillId}`), skill); // Thêm kỹ năng vào Realtime Database
    console.log(`Skill ${skillId} added successfully!`);
  } catch (error) {
    console.error(`Error adding skill ${skillId}:`, error);
  }
};

// Cập nhật kỹ năng
export const updateSkill = async (mask, updatedData) => {
  try {
    const skillRef = ref(database, `skills/${mask}`);
    await update(skillRef, updatedData); // Cập nhật kỹ năng
    console.log(`Skill ${mask} updated successfully!`);
  } catch (error) {
    console.error(`Error updating skill ${mask}:`, error);
    throw error;
  }
};

// Xóa kỹ năng
export const deleteSkill = async (mask) => {
  try {
    const skillRef = ref(database, `skills/${mask}`);
    await remove(skillRef); // Xóa kỹ năng
    console.log(`Skill ${mask} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting skill ${mask}:`, error);
    throw error;
  }
};

// Đọc tất cả kỹ năng
export const readSkills = async () => {
  try {
    const skillsRef = ref(database, "skills");
    const snapshot = await get(skillsRef); // Lấy dữ liệu từ Realtime Database

    if (snapshot.exists()) {
      const skills = snapshot.val();
      return Object.keys(skills).map((key) => ({
        mask: key, // Mã kỹ năng
        tensk: skills[key].tensk, // Tên kỹ năng
      }));
    } else {
      console.log("No skills available");
      return [];
    }
  } catch (error) {
    console.error("Error reading skills:", error);
    return [];
  }
};

// Đọc thông tin một kỹ năng cụ thể
export const readSkill1 = async (mask) => {
  try {
    const skillRef = ref(database, `skills/${mask}`);
    const snapshot = await get(skillRef); // Lấy dữ liệu từ Realtime Database

    if (snapshot.exists()) {
      const skillData = snapshot.val();
      return { mask, tensk: skillData.tensk }; // Giả sử 'tensk' là tên kỹ năng
    } else {
      console.log("Kỹ năng không tồn tại");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi đọc kỹ năng:", error);
    return null;
  }
};

// Thêm kỹ năng nhân viên
export const addSkillNV = async (Skill) => {
  try {
    const skillRef = ref(database, `skillnhanvien/${Skill.employeeId}-${Skill.mask}`);
    await set(skillRef, Skill); // Thêm kỹ năng nhân viên
    console.log(`Employee ${Skill.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

// Lấy danh sách kỹ năng của nhân viên
export const readSkillNhanVien = async () => {
  try {
    const skillNhanVienRef = ref(database, "skillnhanvien");
    const snapshot = await get(skillNhanVienRef); // Lấy dữ liệu từ Realtime Database

    if (snapshot.exists()) {
      const skillnhanvien = snapshot.val();
      const result = {};
      Object.keys(skillnhanvien).forEach((key) => {
        result[key] = skillnhanvien[key];
      });
      return result;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading employees:", error);
    return null;
  }
};
