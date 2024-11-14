import { getDatabase, ref, set, get, update, remove, child } from "firebase/database";
import { app } from "../config/firebaseconfig";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Function to add an employee to Realtime Database
export const addEmployee = async (employee) => {
>>>>>>> 40.2_huy_fix
  try {
    const sanitizedEmployee = {};
    Object.keys(employee).forEach((key) => {
      if (employee[key] !== undefined) {
        sanitizedEmployee[key] = employee[key];
      }
    });

    await set(ref(database, `employees/${employee.employeeId}`), sanitizedEmployee);
    console.log("Employee successfully added to Realtime Database!");
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

// Function to add employee data and profile image to Realtime Database
export async function addEmployeeWithImage(employeeData, profileImage) {
  try {
    employeeData.matKhau = employeeData.employeeId;

    const imageRef = storageRef(storage, `employee/${employeeData.employeeId}.jpg`);

    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    const imageUrl = await getDownloadURL(imageRef);
    const employee = { ...employeeData, imageUrl };

    await set(ref(database, `employees/${employeeData.employeeId}`), employee);
    console.log(`Employee ${employeeData.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Đọc danh sách nhân viên
export async function readEmployees() {
  try {
    const snapshot = await get(ref(database, "employees"));

    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));
      return employees;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading employees:", error);
  }
}

// Function to update employee info
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    await update(ref(database, `employees/${employeeId}`), employeeData);
    console.log(`Employee ${employeeId} updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employeeId}:`, error);
  }
};

// Function to delete employee
export const deleteEmployee = async (employeeId) => {
  try {
    await remove(ref(database, `employees/${employeeId}`));
    console.log(`Employee ${employeeId} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting employee ${employeeId}:`, error);
  }
};

// Toggle employee status
export const toggleEmployeeStatus = async (employeeId, currentStatus) => {
  try {
    const newStatus = !currentStatus;
    await update(ref(database, `employees/${employeeId}`), { trangthai: newStatus });
    console.log(`Employee ${employeeId} status updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employeeId} status:`, error);
  }
};
// Create ChucVu
export const createChucVu = async (chucvu_id, chucVu) => {
  try {
    const db = getDatabase();
    const chucVuRef = ref(db, `chucvu/${chucvu_id}`);
    await set(chucVuRef, chucVu); // Set data at the specific location
    console.log(`Chức vụ ${chucvu_id} đã được thêm thành công`);
  } catch (error) {
    console.error(`Lỗi khi thêm chức vụ ${chucvu_id}:`, error);
  }
};


// Function to add department (Phòng Ban)
export function writePhongBan(phongBan) {
  const maPhongBan = phongBan.maPhongBan;
  set(ref(database, `phongban/${maPhongBan}`), phongBan)
    .then(() => {
      console.log(`Phòng ban ${maPhongBan} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing phòng ban ${maPhongBan}:`, error);
    });
}

// Function to read department (Phòng Ban) list
export async function readPhongBan() {
  try {
    const snapshot = await get(ref(database, "phongban"));

    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));
      return phongBans;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading phong ban:", error);
  }
}

// Position Functions (Chức vụ)
export const createChucVu = async (chucvuId, chucVu) => {
  try {
    await set(ref(database, `chucvu/${chucvuId}`), chucVu);
    console.log(`Chức vụ ${chucvuId} added successfully!`);
  } catch (error) {
    console.error(`Error adding chức vụ ${chucvuId}:`, error);
  }
};

export const readChucVu = async () => {
  try {
    const snapshot = await get(ref(database, "chucvu"));

    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading chuc vu data:", error);
  }
};

// Update Position (Chức vụ)
export const updateChucVu = async (maChucVu, updatedData) => {
  try {
    await update(ref(database, `chucvu/${maChucVu}`), updatedData);
    console.log(`Chức vụ ${maChucVu} updated successfully!`);
  } catch (error) {
    console.error(`Error updating chức vụ ${maChucVu}:`, error);
  }
};

// Delete Position (Chức vụ)
export const deleteChucVu = async (chucvuId) => {
  try {
    await remove(ref(database, `chucvu/${chucvuId}`));
    console.log(`Chức vụ ${chucvuId} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting chức vụ ${chucvuId}:`, error);
  }
};

// Qualification Functions (Bằng cấp)
export function writeBangCap(bangCap) {
  const bangCapId = bangCap.bangcap_id;
  set(ref(database, `bangcap/${bangCapId}`), bangCap)
    .then(() => {
      console.log(`Bằng cấp ${bangCapId} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing bằng cấp ${bangCapId}:`, error);
    });
}

// Đọc danh sách bằng cấp
export async function readBangCap() {
  try {
    const snapshot = await get(ref(database, "bangcap"));

    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));
      return bangCaps;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading bằng cấp:", error);
  }
}

    console.error("Error reading bang cap:", error);
  }
}

// Update Qualification (Bằng cấp)
export async function updateBangCap(bangcapId, tenBang) {
  try {
    await update(ref(database, `bangcap/${bangcapId}`), { tenBang });
    console.log(`Bằng cấp ${bangcapId} updated successfully!`);
  } catch (error) {
    console.error(`Error updating bằng cấp ${bangcapId}:`, error);
  }
}

// Delete Qualification (Bằng cấp)
export async function deleteBangCap(bangCapId) {
  try {
    await remove(ref(database, `bangcap/${bangCapId}`));
    console.log(`Bằng cấp ${bangCapId} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting bằng cấp ${bangCapId}:`, error);
  }
}

// Get employee by ID
export const getEmployeeById = async (employeeId) => {
  try {
    const snapshot = await get(child(ref(database), `employees/${employeeId}`));
    if (snapshot.exists()) {
      return { id: employeeId, ...snapshot.val() };
    }
    console.log(`Employee with ID ${employeeId} not found`);
    return null;
  } catch (error) {
    console.error("Error retrieving employee:", error);
  }
};

// Xóa bằng cấp
export const removeBangCap = async (bangCapId) => {
  try {
    const bangCapRef = ref(database, `bangcap/${bangCapId}`);
    await remove(bangCapRef);
    console.log(`Bằng cấp ${bangCapId} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa bằng cấp ${bangCapId}:`, error);
  }
};

// Lấy danh sách nhân viên theo phòng ban
export async function readEmployeesByPhongBan(phongBanId) {
  try {
    const employeeRef = query(
      ref(database, "employees"),
      orderByChild("phongbanId"),
      equalTo(phongBanId)
    );
    const snapshot = await get(employeeRef);
    if (snapshot.exists()) {
      const employees = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
      }));
      return employees;
    } else {
      console.log("No employees found for this department");
      return null;
    }
  } catch (error) {
    console.error("Error reading employees by department:", error);
  }
}

// Thêm thông tin chấm công vào Realtime Database
export async function addChamCong(chamCongData) {
  try {
    const newChamCongRef = push(ref(database, "chamcong"));
    await set(newChamCongRef, chamCongData);
    console.log("Attendance record added successfully!");
  } catch (error) {
    console.error("Error adding attendance record:", error);
  }
}

// Đọc danh sách chấm công
export async function readChamCong() {
  try {
    const snapshot = await get(ref(database, "chamcong"));
    if (snapshot.exists()) {
      const chamCong = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
      }));
      return chamCong;
    } else {
      console.log("No attendance data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading attendance records:", error);
  }
}
