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

import { updateDoc,query, where } from "firebase/firestore"; // Đảm bảo đã import hàm này





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

// Hàm lấy chi tiết bằng cấp của nhân viên dựa trên bangcap_id và employeeId
export async function readBangCapNhanVien1(bangcap_id, employeeId) {
  try {
    const bangCapRef = collection(firestore, "bangcapnhanvien");
    const q = query(
      bangCapRef,
      where("bangcap_id", "==", bangcap_id),
      where("employeeId", "==", employeeId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const bangCapDetail = querySnapshot.docs[0].data(); // Lấy tài liệu đầu tiên khớp với điều kiện
      return bangCapDetail;
    } else {
      console.log("No document found with the provided bangcap_id and employeeId");
      return {}; // Trả về đối tượng rỗng nếu không tìm thấy dữ liệu
    }
  } catch (error) {
    console.error("Error reading qualification by bangcap_id and employeeId:", error);
    return {}; // Trả về đối tượng rỗng nếu xảy ra lỗi
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

// Cập nhật trạng thái xác thực bằng cấp
export async function toggleXacthuc(employeeId, bangcapId) {
  try {
    // Kiểm tra đường dẫn đến bộ sưu tập bằng cấp của nhân viên
    const docRef = doc(firestore, "bangcapnhanvien", `${employeeId}-${bangcapId}`);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const currentXacthuc = docSnapshot.data().xacthuc;

      // Cập nhật giá trị xacthuc
      const newXacthuc = currentXacthuc === "0" ? "1" : "0";
      await updateDoc(docRef, { xacthuc: newXacthuc });

      console.log(`Cập nhật xacthuc thành công cho ${employeeId} - ${bangcapId}:`, newXacthuc);
      return newXacthuc;
    } else {
      console.log("Không tìm thấy tài liệu để cập nhật!");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật xacthuc:", error);
    return null;
  }
}
