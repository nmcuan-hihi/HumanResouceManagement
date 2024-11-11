import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { app } from "../config/firebaseconfig"; // Để đảm bảo bạn đã cấu hình đúng

import dayjs from "dayjs"; // Sử dụng thư viện dayjs để dễ dàng xử lý thời gian
const firestore = getFirestore(app);

export async function getCongThucLuong() {
  try {
    const querySnapshot = await getDocs(collection(firestore, "congthucluong"));

    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0]; // Lấy document đầu tiên
      return firstDoc.data();
      return;
    } else {
      console.log("Collection rỗng!");
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }
}

export async function updateCongThucLuong(newData) {
  try {
    const docRef = doc(firestore, "congthucluong", "ctl1");
    await updateDoc(docRef, newData);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

export async function getAllChamCongDetails() {
  try {
    const chamCongCollection = collection(firestore, "chitietchamcong");

    const querySnapshot = await getDocs(chamCongCollection);

    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();

      // Kiểm tra và chuyển đổi trường 'month' từ Timestamp sang định dạng mong muốn
      let formattedMonth = null;
      if (docData.month) {
        const monthDate = docData.month.toDate(); // Chuyển đổi từ Timestamp sang Date
        formattedMonth = dayjs(monthDate).format("YYYY-MM-DD"); // Định dạng ngày theo ý muốn
      }

      return {
        id: doc.id, // Lấy ID của document
        ...docData, // Lấy dữ liệu của document
        month: formattedMonth, // Thêm trường đã định dạng vào kết quả
      };
    });

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ collection:", error);
    throw error;
  }
}
export async function getChamCongDetailsByMonth(year, month) {
  try {
    // Tham chiếu đến collection 'chitietchamcong'
    const chamCongCollection = collection(firestore, "chitietchamcong");

    // Tạo mốc thời gian bắt đầu và kết thúc cho tháng cần tìm
    const startOfMonth = dayjs(`${year}-${month + 1}-01`).toDate();
    const endOfMonth = dayjs(`${year}-${month + 2}-01`).toDate();

    // Tạo truy vấn để lấy các tài liệu có 'month' trong khoảng thời gian trên
    const monthQuery = query(
      chamCongCollection,
      where("month", ">=", startOfMonth),
      where("month", "<", endOfMonth)
    );

    // Lấy các tài liệu phù hợp với truy vấn
    const querySnapshot = await getDocs(monthQuery);

    // Duyệt qua từng tài liệu và xử lý dữ liệu của trường 'month'
    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();

      // Chuyển 'month' từ Timestamp sang Date
      const monthDate = docData.month.toDate();

      // Chuyển đổi sang định dạng chuỗi mong muốn, ví dụ: 'YYYY-MM-DD'
      const formattedMonth = dayjs(monthDate).format("YYYY-MM-DD");

      return {
        id: doc.id,
        ...docData,
        month: formattedMonth, // Thêm trường đã định dạng vào kết quả
      };
    });

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ collection:", error);
    throw error;
  }
}
