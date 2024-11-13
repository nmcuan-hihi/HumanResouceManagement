// Import các thư viện và cấu hình Firebase
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";
import { app } from "../config/firebaseconfig";

const database = getDatabase(app);

// Hàm lọc nhân viên theo phòng ban
export async function filterEmployeesByPhongBan(phongbanId) {
  try {
    const employeesRef = ref(database, "employees");
    const q = query(employeesRef, orderByChild("phongbanId"), equalTo(phongbanId));
    const snapshot = await get(q);

    // Kiểm tra nếu snapshot không có dữ liệu, trả về mảng trống
    if (!snapshot.exists()) {
      return [];
    }

    const filteredEmployees = [];
    snapshot.forEach(doc => {
      filteredEmployees.push({ ...doc.val(), manv: doc.key });
    });

    return filteredEmployees;
  } catch (error) {
    console.error("Error filtering employees by phòng ban:", error);
    // Trả về mảng trống nếu có lỗi
    return [];
  }
}


// Hàm lọc nhân viên theo giới tính
export async function filterEmployeesByGender(gender) {
  try {
    const employeesRef = ref(database, "employees");
    const q = query(employeesRef, orderByChild("gioitinh"), equalTo(gender));
    const snapshot = await get(q);

    const filteredEmployees = [];
    snapshot.forEach(doc => {
      filteredEmployees.push({ ...doc.val(), manv: doc.key });
    });

    return filteredEmployees;
  } catch (error) {
    console.error("Error filtering employees by gender:", error);
    return [];
  }
}

// Hàm lọc nhân viên theo trạng thái hoạt động
export async function filterEmployeesByStatus(status) {
  try {
    const employeesRef = ref(database, "employees");
    const q = query(employeesRef, orderByChild("trangthai"), equalTo(status));
    const snapshot = await get(q);

    const filteredEmployees = [];
    snapshot.forEach(doc => {
      filteredEmployees.push({ ...doc.val(), manv: doc.key });
    });

    return filteredEmployees;
  } catch (error) {
    console.error("Error filtering employees by status:", error);
    return [];
  }
}

// Hàm tìm kiếm nhân viên theo tên hoặc mã nhân viên
export async function searchEmployeesByNameOrId(searchTerm) {
  try {
    const employeesRef = ref(database, "employees");
    const snapshot = await get(employeesRef);

    const searchResults = {};
    snapshot.forEach(doc => {
      const employee = doc.val();
      const employeeName = employee.name || "";
      const employeeId = employee.employeeId || "";

      if (
        (typeof employeeName === 'string' && employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof employeeId === 'string' && employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        searchResults[doc.key] = employee;
      }
    });

    return searchResults;
  } catch (error) {
    console.error("Error searching employees by name or ID:", error);
    return {};
  }
}

// Hàm đọc thông tin phòng ban từ Realtime Database
export async function readPhongBanFromRealtime() {
  try {
    const phongBanRef = ref(database, "phongban");
    const snapshot = await get(phongBanRef);

    const phongBanData = [];
    snapshot.forEach(doc => {
      phongBanData.push({
        maPhongBan: doc.key,
        maQuanLy: doc.val().maQuanLy,
        tenPhongBan: doc.val().tenPhongBan,
      });
    });

    return phongBanData;
  } catch (error) {
    console.error("Error reading phong ban:", error);
    return [];
  }
}

// Hàm tìm kiếm nhân viên theo mã nhân viên
export async function searchEmployeesById(employeeId) {
  try {
    const employeesRef = ref(database, "employees");
    const q = query(employeesRef, orderByChild("employeeId"), equalTo(employeeId));
    const snapshot = await get(q);

    const searchResults = [];
    snapshot.forEach(doc => {
      searchResults.push({ ...doc.val(), manv: doc.key });
    });

    return searchResults;
  } catch (error) {
    console.error("Error searching employees by employee ID:", error);
    return [];
  }
}

// Hàm lọc nhân viên theo nhiều tiêu chí (phòng ban, giới tính, trạng thái)
export async function filterEmployees({ phongbanId, gender, status }) {
  try {
    const employeesRef = ref(database, "employees");
    let q = employeesRef;

    // Thêm điều kiện lọc nếu tồn tại
    if (phongbanId) {
      q = query(q, orderByChild("phongbanId"), equalTo(phongbanId));
    }
    if (gender) {
      q = query(q, orderByChild("gioitinh"), equalTo(gender));
    }
    if (status !== undefined) {
      q = query(q, orderByChild("trangthai"), equalTo(status));
    }

    const snapshot = await get(q);

    const filteredEmployees = [];
    snapshot.forEach(doc => {
      filteredEmployees.push({ ...doc.val(), manv: doc.key });
    });

    return filteredEmployees;
  } catch (error) {
    console.error("Error filtering employees:", error);
    return [];
  }
}
