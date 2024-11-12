import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { app } from "../config/firebaseconfig"; // Để đảm bảo bạn đã cấu hình đúng
import { Timestamp } from 'firebase/firestore';
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
export async function getChamCongDetailsByEmployeeId(employeeId) {
  try {
    const chamCongCollection = collection(firestore, "chitietchamcong");
    const q = query(chamCongCollection, where("employeeId", "==", employeeId));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      const checkIn = docData.timeIn; // Assuming timeIn is the field name
      const checkOut = docData.timeOut; // Assuming timeOut is the field name

      // Convert timeIn and timeOut to Date if they are Timestamps
      const checkInDate = checkIn instanceof Timestamp ? checkIn.toDate() : new Date(checkIn);
      const checkOutDate = checkOut instanceof Timestamp ? checkOut.toDate() : new Date(checkOut);

      // Calculate the hours worked
      const hoursWorked = (checkOutDate - checkInDate) / (1000 * 60 * 60); // Convert milliseconds to hours

      return {
        id: doc.id,
        date: dayjs(checkInDate).format("YYYY-MM-DD"),
        checkIn: dayjs(checkInDate).format("HH:mm"),
        checkOut: dayjs(checkOutDate).format("HH:mm"),
        hoursWorked: hoursWorked.toFixed(2), // Hours worked rounded to two decimal places
      };
    });

    return data;
  } catch (error) {
    console.error("Error fetching timekeeping data:", error);
    throw error;
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
export async function getBangLuong() {
  try {
    // Tham chiếu đến collection 'bangluongnhanvien'
    const bangluongCollection = collection(firestore, "bangluongnhanvien");

    // Lấy các tài liệu từ collection
    const querySnapshot = await getDocs(bangluongCollection);

    // Duyệt qua từng tài liệu và trả về dữ liệu
    const data = querySnapshot.docs.map((doc) => {
      const docData = doc.data();
      return {
        id: doc.id,
        chuyencan: docData.chuyencan,
        employeeId: docData.employeeId,
        luong: docData.luong,
        ngaycong: docData.ngaycong,
        phucap: docData.phucap,
        tangca: docData.tangca,
        thamnien: docData.thamnien,
        thang: docData.thang,
        thucnhan: docData.thucnhan,
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

export async function luuDanhSachLuongFirebase(salaryList) {
  const salaryCollection = collection(firestore, "bangluongnhanvien");

  salaryList.forEach(async (salaryEntry) => {
    const salaryData = salaryEntry;
    const documentKey = `${salaryData.employeeId}-${salaryData.thang}`;

    const docRef = doc(salaryCollection, documentKey);

    try {
      await setDoc(docRef, salaryData);
      console.log("Document successfully written for key: ", documentKey);
    } catch (error) {
      console.error("Error writing document for key: ", documentKey, error);
    }
  });
}

export async function layDanhSachBangLuongTheoThang(thang) {
  const salaryCollection = collection(firestore, "bangluongnhanvien");

  const querySnapshot = await getDocs(
    query(salaryCollection, where("thang", "==", thang))
  );

  const salaryList = [];
  querySnapshot.forEach((doc) => {
    salaryList.push({ id: doc.id, ...doc.data() });
  });

  return salaryList;
}
