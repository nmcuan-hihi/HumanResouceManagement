

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
import { firestore } from "../config/firebaseconfig";

import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  setDoc, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage

// Hàm lọc nhân viên theo phòng ban

export async function filterEmployeesByPhongBan(phongbanId) {
  try {
    const employeesRef = collection(firestore, "employees"); // Tham chiếu đến collection 'employees'
    const q = query(employeesRef, where("phongbanId", "==", phongbanId)); // Tạo truy vấn lọc theo phòng ban
    const snapshot = await getDocs(q);

    const filteredEmployees = snapshot.docs.map((doc) => ({
      ...doc.data(),
      manv: doc.id,
    })); // Thêm mã nhân viên vào đối tượng
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
    const q = query(employeesRef, where("gioitinh", "==", gender)); // Tạo truy vấn lọc theo giới tính
    const snapshot = await getDocs(q);

    const filteredEmployees = snapshot.docs.map((doc) => ({
      ...doc.data(),
      manv: doc.id,
    })); // Thêm mã nhân viên vào đối tượng
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
    const q = query(employeesRef, where("trangthai", "==", status)); // Tạo truy vấn lọc theo trạng thái
    const snapshot = await getDocs(q);

    const filteredEmployees = snapshot.docs.map((doc) => ({
      ...doc.data(),
      manv: doc.id,
    })); // Thêm mã nhân viên vào đối tượng
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
    const snapshot = await getDocs(employeesRef);

    const searchResults = snapshot.docs.reduce((result, doc) => {
      const employee = doc.data();
      const employeeName = employee.name || "";
      const employeeId = employee.employeeId || "";

      if (
        employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        result[doc.id] = { ...employee, manv: doc.id }; // Thêm nhân viên vào kết quả
      }

      return result;
    }, {});

    return searchResults; // Trả về đối tượng chứa các nhân viên tìm thấy
  } catch (error) {
    console.error("Error searching employees by name or ID:", error);
    return {};
  }
}

// Hàm tìm kiếm nhân viên theo mã nhân viên
export async function searchEmployeesById(employeeId) {
  try {
    const employeesRef = collection(firestore, "employees");
    const snapshot = await getDocs(employeesRef);

    const searchResults = snapshot.docs
      .filter((doc) => doc.data().employee_id === employeeId)
      .map((doc) => doc.data());
    return searchResults; // Trả về danh sách nhân viên tìm thấy
  } catch (error) {
    console.error("Error searching employees by employee ID:", error);
    return [];
  }
}
// Hàm lọc theo nhiều tiêu chí (phòng ban, giới tính, trạng thái)

export async function filterEmployees({ phongbanId, gender, status }) {
  try {
    const employeesRef = collection(firestore, "employees"); // Tham chiếu đến collection 'employees'
    let q = employeesRef; // Khởi tạo q với tham chiếu đến collection

    // Xây dựng truy vấn dựa trên các tiêu chí lọc
    if (phongbanId) {
      q = query(q, where("phongbanId", "==", phongbanId)); // thêm điều kiện phòng ban
    }

    if (gender) {
      q = query(q, where("gioitinh", "==", gender)); // thêm điều kiện giới tính
    }

    if (status !== undefined) {
      q = query(q, where("trangthai", "==", status)); // thêm điều kiện trạng thái
    }

    const snapshot = await getDocs(q); // Thực hiện truy vấn

    // Chuyển đổi kết quả thành mảng đối tượng
    const employees = snapshot.docs.map((doc) => ({
      ...doc.data(),
      manv: doc.id,
    }));

    return employees; // Trả về danh sách nhân viên đã lọc
  } catch (error) {
    console.error("Error filtering employees:", error);
    return [];
  }
}
