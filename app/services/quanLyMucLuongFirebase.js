import {
  getDatabase,
  ref,
  get,
  update,
  query,
  orderByChild,
  equalTo,
  push,
} from "firebase/database";
import { app } from "../config/firebaseconfig"; // Đảm bảo bạn đã cấu hình đúng
import dayjs from "dayjs"; // Sử dụng thư viện dayjs để dễ dàng xử lý thời gian
import { store } from "../redux/store"; // Import Redux store to access idCty
const db = getDatabase(app);

// Lấy công thức lương từ Realtime Database
export async function getCongThucLuong() {
  try {
    const congThucLuongRef = ref(db, "congthucluong/ctl1");
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
export async function getEmployeeSalaryAndAttendance(employeeId, month) {
  try {
    // Validate input
    if (!employeeId || !month) {
      throw new Error("employeeId và month là bắt buộc");
    }

    // Parse month string to Date object
    const targetMonth = dayjs(month, "M-YYYY");
    if (!targetMonth.isValid()) {
      throw new Error("Định dạng tháng không hợp lệ. Sử dụng định dạng MM-YYYY");
    }

    // 1. Lấy bảng lương
    const bangLuongRef = query(ref(db, "bangluongnhanvien"));
    const bangLuongSnapshot = await get(bangLuongRef);
    
    let salaryData = null;
    bangLuongSnapshot.forEach((doc) => {
      const data = doc.val();
      if (data.employeeId === employeeId && data.thang === month) {
        salaryData = {
          id: doc.key,
          ...data,
          // // Đảm bảo các giá trị số được parse đúng
          // luong: String(data.luong) || "",
          // phucap: String(data.phucap) || "",
          // thucnhan: String(data.thucnhan) || "",
        };
      }
    });

   // 2. Lấy chi tiết chấm công
const chamCongRef = query(ref(db, "chitietchamcong"));
const chamCongSnapshot = await get(chamCongRef);

const attendanceData = [];
chamCongSnapshot.forEach((doc) => {
  const docData = doc.val();
  const docMonth = dayjs(docData.month);

  if (
    docData.employeeId === employeeId &&
    docMonth.format("YYYY-M-D") === targetMonth.format("YYYY-M-D")
  ) {
    // Lấy thời gian vào và ra, giữ dưới dạng chuỗi mà không định dạng
    const checkIn = docData.timeIn ? String(docData.timeIn) : "";
    const checkOut = docData.timeOut ? String(docData.timeOut) : "";

    // Tính số giờ làm việc
    let hoursWorked = 0;
    if (checkIn && checkOut) {
      const checkInDate = dayjs(checkIn * 1000);
      const checkOutDate = dayjs(checkOut * 1000);
      hoursWorked = checkOutDate.diff(checkInDate, 'hour', true);
    }
console.log(`Checking attendance for employee: ${docData.employeeId}, month: ${docMonth.format("YYYY-M-D")}`);
    attendanceData.push({
      id: doc.key,
      date: docMonth.format("YYYY-M-D"),
      timeIn: checkIn,  // Giữ dưới dạng chuỗi
      timeOut: checkOut,  // Giữ dưới dạng chuỗi
      hoursWorked: hoursWorked.toFixed(2),
      status: docData.status || "unknown",
      maChamCong: docData.maChamCong
    });
  }
});

// 3. Tổng hợp thông tin
const summary = {
  totalDays: attendanceData.length,
  workingDays: attendanceData.filter(d => d.status === "di_lam").length,
  totalHours: attendanceData.reduce((sum, curr) => sum + parseFloat(curr.hoursWorked), 0),
  month: month,
  employeeId: employeeId
};

// 4. Trả về kết quả tổng hợp
return {
  salary: salaryData,
  attendance: attendanceData.sort((a, b) => new Date(a.date) - new Date(b.date)),
  summary: summary
};

  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    throw error;
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
    const chamCongRef = query(
      ref(db, "chitietchamcong"),
      orderByChild("employeeId"),
      equalTo(employeeId)
    );
    const snapshot = await get(chamCongRef);

    const data = [];
    snapshot.forEach((doc) => {
      const docData = doc.val();

        const checkIn = new Date(docData.timeIn);
        const checkOut = new Date(docData.timeOut);
        const hoursWorked = (checkOut - checkIn) / (1000 * 60 * 60);
        data.push({
          id: doc.key,
          month: dayjs().format("YYYY-M-D"),
          checkIn: dayjs().format("HH:mm"),
          checkOut: dayjs().format("HH:mm"),
          hoursWorked: hoursWorked.toFixed(2),
        });
      
    });

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu chấm công:", error);
    throw error;
  }
}
// Lấy chi tiết chấm công theo tháng
export async function getChamCongDetailsByMonth(employeeId, thang) {
  try {
    const chamCongRef = ref(db, "chitietchamcong");
    const snapshot = await get(chamCongRef);

    const data = [];
    snapshot.forEach((doc) => {
      const key = doc.key;
      const [employeeIdFromDB, day, month, year] = key.split("-");

      // Filter by employeeId and month-year
      if (employeeIdFromDB === employeeId && `${month}-${year}` === thang) {
        const record = doc.val();
        
        // Add other fields like status, diMuon, etc., if needed
        data.push({
          ...record,
          id: doc.key,
          date: day,
          month,
          year,
        });
      }
    });

    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Realtime Database:", error);
    throw new Error("Không thể lấy dữ liệu chấm công.");
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

export async function getChamCongByMonth(thang) {
  try {
    const chamCongRef = ref(db, "chitietchamcong");
    const snapshot = await get(chamCongRef);

    const data = [];
    snapshot.forEach((doc) => {
      const key = doc.key;
      const [employeeId, day, month, year] = key.split("-");

      if (`${month}-${year}` === thang) {
        data.push(doc.val());
      }
    });


    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ Realtime Database:", error);
    throw new Error("Không thể lấy dữ liệu chấm công.");
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
    const bangLuongRef = query(ref(db, "bangluongnhanvien"));
    const snapshot = await get(bangLuongRef);

    const salaryList = [];
    snapshot.forEach((doc) => {
      const key = doc.key;
      const [employeeId, month, year] = key.split("-");

      if (`${month}-${year}` === thang) {
        salaryList.push(doc.val());
      }
    });

    return salaryList;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ collection:", error);
    throw error;
  }
}
