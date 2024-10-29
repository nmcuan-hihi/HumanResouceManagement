// Import các thư viện và cấu hình Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { app, firestore } from "../config/firebaseconfig"; // Đảm bảo cấu hình đúng

// Khởi tạo Firebase Storage (nếu cần thiết)
const storage = getStorage(app);

// Hàm lọc nhân viên theo phòng ban
export async function filterEmployeesByPhongBan(phongbanId) {
  try {
    const employeesRef = collection(firestore, "employees");
    const q = query(employeesRef, where("phongbanId", "==", phongbanId));
    const querySnapshot = await getDocs(q);

    const filteredEmployees = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      manv: doc.id
    }));

    return filteredEmployees;
  } catch (error) {
    console.error("Error filtering employees by phòng ban:", error);
    return [];
  }
}

// Hàm lọc nhân viên theo giới tính
export async function filterEmployeesByGender(gender) {
  try {
    const employeesRef = collection(firestore, "employees");
    const q = query(employeesRef, where("gioitinh", "==", gender));
    const querySnapshot = await getDocs(q);

    const filteredEmployees = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      manv: doc.id
    }));

    return filteredEmployees;
  } catch (error) {
    console.error("Error filtering employees by gender:", error);
    return [];
  }
}

// Hàm lọc nhân viên theo trạng thái hoạt động
export async function filterEmployeesByStatus(status) {
  try {
    const employeesRef = collection(firestore, "employees");
    const q = query(employeesRef, where("trangthai", "==", status));
    const querySnapshot = await getDocs(q);

    const filteredEmployees = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      manv: doc.id
    }));

    return filteredEmployees;
  } catch (error) {
    console.error("Error filtering employees by status:", error);
    return [];
  }
}

// Hàm tìm kiếm nhân viên theo tên hoặc mã nhân viên
export async function searchEmployeesByNameOrId(searchTerm) {
  try {
    const employeesRef = collection(firestore, "employees");
    const querySnapshot = await getDocs(employeesRef);

    const searchResults = querySnapshot.docs.reduce((result, doc) => {
      const employee = doc.data();
      const employeeName = employee.name || "";
      const employeeId = employee.employeeId || "";

      if (
        (typeof employeeName === 'string' && employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (typeof employeeId === 'string' && employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        result[doc.id] = employee;
      }

      return result;
    }, {});

    return searchResults;
  } catch (error) {
    console.error("Error searching employees by name or ID:", error);
    return {};
  }
}

// Hàm đọc thông tin phòng ban từ Firestore
export async function readPhongBan1Firestore() {
  try {
    const phongBanCollection = collection(firestore, "phongban");
    const phongBanSnapshot = await getDocs(phongBanCollection);

    return phongBanSnapshot.docs.map(doc => ({
      maPhongBan: doc.id,
      maQuanLy: doc.data().maQuanLy,
      tenPhongBan: doc.data().tenPhongBan,
    }));
  } catch (error) {
    console.error("Error reading phong ban:", error);
    return [];
  }
}

// Hàm tìm kiếm nhân viên theo mã nhân viên
export async function searchEmployeesById(employeeId) {
  try {
    const employeesRef = collection(firestore, "employees");
    const q = query(employeesRef, where("employeeId", "==", employeeId));
    const querySnapshot = await getDocs(q);

    const searchResults = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      manv: doc.id
    }));

    return searchResults;
  } catch (error) {
    console.error("Error searching employees by employee ID:", error);
    return [];
  }
}

// Hàm lọc nhân viên theo nhiều tiêu chí (phòng ban, giới tính, trạng thái)
export async function filterEmployees({ phongbanId, gender, status }) {
  try {
    const employeesRef = collection(firestore, "employees");
    let q = employeesRef;

    // Thêm điều kiện lọc nếu tồn tại
    if (phongbanId) {
      q = query(q, where("phongban_id", "==", phongbanId));
    }
    if (gender) {
      q = query(q, where("gioitinh", "==", gender));
    }
    if (status !== undefined) {
      q = query(q, where("trangthai", "==", status));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      manv: doc.id
    }));
  } catch (error) {
    console.error("Error filtering employees:", error);
    return [];
  }
}
