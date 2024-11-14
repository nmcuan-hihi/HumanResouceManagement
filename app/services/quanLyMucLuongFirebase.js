import { getDatabase, ref, get, update, query, orderByChild, equalTo, push } from "firebase/database";
import { app } from "../config/firebaseconfig"; // Đảm bảo bạn đã cấu hình đúng
import dayjs from "dayjs"; // Sử dụng thư viện dayjs để dễ dàng xử lý thời gian

const db = getDatabase(app);

// Lấy công thức lương từ Realtime Database
export async function getCongThucLuong() {
  try {
    const congThucLuongRef = ref(db, "congthucluong");
    const snapshot = await get(congThucLuongRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("Không tìm thấy dữ liệu công thức lương!");
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
  }
}

// Cập nhật công thức lương
export async function updateCongThucLuong(newData) {
  try {
    const congThucLuongRef = ref(db, "congthucluong/ctl1");
    await update(congThucLuongRef, newData);
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
}

// Lấy chi tiết chấm công theo employeeId
export async function getChamCongDetailsByEmployeeId(employeeId) {
  try {
    const chamCongRef = query(ref(db, "chitietchamcong"), orderByChild("employeeId"), equalTo(employeeId));
    const snapshot = await get(chamCongRef);

    const data = [];
    snapshot.forEach((doc) => {
      const docData = doc.val();
      const checkInDate = new Date(docData.timeIn * 1000);
      const checkOutDate = new Date(docData.timeOut * 1000);
      const hoursWorked = (checkOutDate - checkInDate) / (1000 * 60 * 60);

      data.push({
        id: doc.key,
        date: dayjs(checkInDate).format("YYYY-MM-DD"),
        checkIn: dayjs(checkInDate).format("HH:mm"),
        checkOut: dayjs(checkOutDate).format("HH:mm"),
        hoursWorked: hoursWorked.toFixed(2),
      });
    });

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu chấm công:", error);
    throw error;
  }
}

// Lấy tất cả chi tiết chấm công
export async function getAllChamCongDetails() {
  try {
    const chamCongRef = ref(db, "chitietchamcong");
    const snapshot = await get(chamCongRef);

    const data = [];
    snapshot.forEach((doc) => {
      const docData = doc.val();
      let formattedMonth = null;
      if (docData.month) {
        const monthDate = new Date(docData.month * 1000);
        formattedMonth = dayjs(monthDate).format("YYYY-MM-DD");
      }

      data.push({
        id: doc.key,
        ...docData,
        month: formattedMonth,
      });
    });

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ collection:", error);
    throw error;
  }
}

// Lấy bảng lương
export async function getBangLuong() {
  try {
    const bangLuongRef = ref(db, "bangluongnhanvien");
    const snapshot = await get(bangLuongRef);

    const data = [];
    snapshot.forEach((doc) => {
      const docData = doc.val();
      data.push({
        id: doc.key,
        ...docData,
      });
    });

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ collection:", error);
    throw error;
  }
}

// Lấy chi tiết chấm công theo tháng
export async function getChamCongDetailsByMonth(year, month) {
  try {
    const chamCongRef = ref(db, "chitietchamcong");
    const snapshot = await get(chamCongRef);

    const data = [];
    snapshot.forEach((doc) => {
      const docData = doc.val();
      const monthDate = new Date(docData.month * 1000);
      const formattedMonth = dayjs(monthDate).format("YYYY-MM-DD");

      if (
        monthDate.getFullYear() === year &&
        monthDate.getMonth() === month
      ) {
        data.push({
          id: doc.key,
          ...docData,
          month: formattedMonth,
        });
      }
    });

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ collection:", error);
    throw error;
  }
}

// Lưu danh sách lương vào Realtime Database
export async function luuDanhSachLuongFirebase(salaryList) {
  try {
    for (const salaryEntry of salaryList) {
      const documentKey = `${salaryEntry.employeeId}-${salaryEntry.thang}`;
      const salaryRef = ref(db, `bangluongnhanvien/${documentKey}`);

      await update(salaryRef, salaryEntry);
      console.log("Document successfully written for key:", documentKey);
    }
  } catch (error) {
    console.error("Error writing document:", error);
  }
}

// Lấy danh sách bảng lương theo tháng
export async function layDanhSachBangLuongTheoThang(thang) {
  try {
    const bangLuongRef = query(ref(db, "bangluongnhanvien"), orderByChild("thang"), equalTo(thang));
    const snapshot = await get(bangLuongRef);

    const salaryList = [];
    snapshot.forEach((doc) => {
      salaryList.push({
        id: doc.key,
        ...doc.val(),
      });
    });

    return salaryList;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ collection:", error);
    throw error;
  }
}
