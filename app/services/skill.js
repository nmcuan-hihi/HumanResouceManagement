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
  import { initializeApp } from "firebase/app";
  import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  const database = getDatabase(app);
  const storage = getStorage(app); // Khởi tạo Firebase Storage

  export const addSkill = async (skill) => {
    const skillId = skill.mask; // Sử dụng mask làm ID
    try {
      await set(ref(database, `skills/${skillId}`), skill);
      console.log(`Skill ${skillId} added successfully!`);
    } catch (error) {
      console.error(`Error adding skill ${skillId}:`, error);
    }
  };
  export const updateSkill = async (mask, updatedData) => {
    try {
      const skillRef = ref(database, `skills/${mask}`);
      await update(skillRef, updatedData);
      console.log(`Skill ${mask} updated successfully!`);
    } catch (error) {
      console.error(`Error updating skill ${mask}:`, error);
      throw error; // Ném lỗi để xử lý ở component
    }
  };
  export const deleteSkill = async (mask) => {
    try {
      const skillRef = ref(database, `skills/${mask}`);
      await remove(skillRef);
      console.log(`Skill ${mask} deleted successfully!`);
    } catch (error) {
      console.error(`Error deleting skill ${mask}:`, error);
      throw error; // Ném lỗi để xử lý ở component
    }
  };
  export const readSkills = async () => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, "skills"));
  
      if (snapshot.exists()) {
        const skills = snapshot.val();
        return Object.keys(skills).map((key) => ({
          mask: key,
          tensk: skills[key].tensk,
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
    const db = getDatabase(); // Lấy instance của database
    const skillRef = ref(db, `skills/${mask}`); // Đường dẫn tới kỹ năng theo mask
  
    try {
      const snapshot = await get(skillRef); // Lấy dữ liệu từ đường dẫn
      if (snapshot.exists()) {
        const skillData = snapshot.val(); // Lấy dữ liệu kỹ năng
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