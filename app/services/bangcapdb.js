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

export async function addBangCapNV(bangCap, image) {
  function random(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  const randomImg = random(20);
  try {
    // Tạo tham chiếu tới nơi lưu trữ hình ảnh
    const imageRef = storageRef(storage, `bangcap/${randomImg}.jpg`);

    // Tải lên hình ảnh
    const response = await fetch(image);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    // Lấy URL hình ảnh
    const imageUrl = await getDownloadURL(imageRef);

    // Cập nhật imageUrl vào employeeData
    const data = { ...bangCap, imageUrl };

    // Ghi dữ liệu nhân viên vào Realtime Database
    await set(
      ref(
        database,
        `bangcapnhanvien/${bangCap.employeeId}-${bangCap.bangcap_id}`
      ),
      data
    );
    console.log(`Employee ${bangCap.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }

}



// doc danh sach bang cap cua nhan vien
export async function readBangCapNhanVien() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "bangcapnhanvien")); 

    if (snapshot.exists()) {
      const bangcapnhanvien = snapshot.val(); 
      return bangcapnhanvien; 
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading employees:", error);
  }
}

