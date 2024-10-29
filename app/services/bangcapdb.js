import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore"; // Import các hàm Firestore
import { app } from "../config/firebaseconfig"; // Giả sử bạn đã cấu hình firebase ở đây
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firestore = getFirestore(app);
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

    // Ghi dữ liệu nhân viên vào Firestore
    await setDoc(doc(firestore, "bangcapnhanvien", `${bangCap.employeeId}-${bangCap.bangcap_id}`), data);
    console.log(`Employee ${bangCap.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Lấy danh sách bằng cấp của nhân viên
export async function readBangCapNhanVien() {
  try {
    const bangCapCollection = collection(firestore, "bangcapnhanvien");
    const snapshot = await getDocs(bangCapCollection);

    if (!snapshot.empty) {
      const bangcapnhanvien = {};
      snapshot.forEach(doc => {
        bangcapnhanvien[doc.id] = doc.data(); // Giả sử bạn muốn giữ id của document làm key
      });
      return bangcapnhanvien; 
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading employees:", error);
  }
}