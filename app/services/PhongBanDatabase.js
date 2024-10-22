// Import Firebase và các hàm cần thiết
import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";
import { app } from "../config/firebaseconfig";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage

// Hàm lọc nhân viên theo phòng ban
export async function filterEmployeesByPhongBan(phongbanId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "employees"));

    if (snapshot.exists()) {
      const employees = snapshot.val();
      const filteredEmployees = Object.keys(employees).reduce((acc, key) => {
        if (employees[key].phongbanId === phongbanId) {
          acc.push({ ...employees[key], manv: key }); // Thêm mã nhân viên vào đối tượng
        }
        return acc;
      }, []);
      return filteredEmployees;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error filtering employees by phòng ban:", error);
    return [];
  }
}

// Hàm lọc nhân viên theo giới tính
export async function filterEmployeesByGender(gender) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "employees"));

    if (snapshot.exists()) {
      const employees = snapshot.val();
      const filteredEmployees = Object.keys(employees).reduce((acc, key) => {
        if (employees[key].gioitinh === gender) {
          acc.push({ ...employees[key], manv: key }); // Thêm mã nhân viên vào đối tượng
        }
        return acc;
      }, []);
      return filteredEmployees;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error filtering employees by gender:", error);
    return [];
  }
}

// Hàm lọc nhân viên theo trạng thái hoạt động
export async function filterEmployeesByStatus(status) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "employees"));

    if (snapshot.exists()) {
      const employees = snapshot.val();
      const filteredEmployees = Object.keys(employees).reduce((acc, key) => {
        if (employees[key].trangthai === status) {
          acc.push({ ...employees[key], manv: key }); // Thêm mã nhân viên vào đối tượng
        }
        return acc;
      }, []);
      return filteredEmployees;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error filtering employees by status:", error);
    return [];
  }
}

// Hàm tìm kiếm nhân viên theo tên hoặc mã nhân viên
export async function searchEmployeesByNameOrId(searchTerm) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "employees"));

    if (snapshot.exists()) {
      const employees = snapshot.val();
      const searchResults = Object.keys(employees).reduce((result, key) => {
        const employee = employees[key];
        const employeeName = employee.name || ""; // Đảm bảo có giá trị mặc định
        const employeeId = employee.employeeId || ""; // Đảm bảo có giá trị mặc định

        // Kiểm tra và sử dụng toLowerCase() chỉ khi là chuỗi
        if (
          (typeof employeeName === 'string' && employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (typeof employeeId === 'string' && employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
        ) {
          result[key] = employee; // Thêm nhân viên vào kết quả
        } else {
          // Log nhân viên không hợp lệ (nếu cần)
          if (!employeeId) {
            console.warn(`Employee with key ${key} is missing employeeId.`);
          }
        }

        return result;
      }, {});

      return searchResults; // Trả về đối tượng chứa các nhân viên tìm thấy
    } else {
      console.log("No data available");
      return {}; // Trả về đối tượng rỗng nếu không có dữ liệu
    }
  } catch (error) {
    console.error("Error searching employees by name or ID:", error);
    return {}; // Trả về đối tượng rỗng trong trường hợp có lỗi
  }
}


// Hàm tìm kiếm nhân viên theo mã nhân viên
export async function searchEmployeesById(employeeId) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "employees"));

    if (snapshot.exists()) {
      const employees = snapshot.val();
      const searchResults = Object.values(employees).filter(employee => employee.employee_id === employeeId);
      return searchResults;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error searching employees by employee ID:", error);
    return [];
  }
}

// Hàm lọc theo nhiều tiêu chí (phòng ban, giới tính, trạng thái)
export async function filterEmployees({ phongbanId, gender, status }) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "employees"));

    if (snapshot.exists()) {
      let employees = Object.values(snapshot.val());

      if (phongbanId) {
        employees = employees.filter(employee => employee.phongban_id === phongbanId);
      }

      if (gender) {
        employees = employees.filter(employee => employee.gioitinh === gender);
      }

      if (status !== undefined) {
        employees = employees.filter(employee => employee.trangthai === status);
      }

      return employees;
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error("Error filtering employees:", error);
    return [];
  }
}
