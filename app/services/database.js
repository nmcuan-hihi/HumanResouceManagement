import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  child,
  push,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { app } from "../config/firebaseconfig";

const database = getDatabase(app); // Khởi tạo Realtime Database

// Hàm ghi dữ liệu nhân viên vào Realtime Database
export const addEmployeeFireStore = async (employee) => {
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

// Ghi dữ liệu nhân viên
export function writeUserData(employee) {
  const employeeId = employee.employeeId;
  set(ref(database, `employees/${employeeId}`), employee)
    .then(() => {
      console.log(`Employee ${employeeId} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing employee ${employeeId}:`, error);
    });
}

// Thêm nhân viên với hình ảnh
export async function addEmployee(employeeData, profileImage) {
  try {
    employeeData.matKhau = employeeData.employeeId;
    const imageRef = ref(database, `employeeImages/${employeeData.employeeId}.jpg`);

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
      const employees = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
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

// Cập nhật thông tin nhân viên
export const updateEmployee = async (employee_id, employeeData) => {
  try {
    const employeeRef = ref(database, `employees/${employee_id}`);
    await update(employeeRef, employeeData);
    console.log(`Employee ${employee_id} updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employee_id}:`, error);
    throw error;
  }
};

// Xóa nhân viên
export const deleteEmployee = async (employee_id) => {
  try {
    const employeeRef = ref(database, `employees/${employee_id}`);
    await remove(employeeRef);
    console.log(`Employee ${employee_id} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting employee ${employee_id}:`, error);
    throw error;
  }
};

// Chuyển đổi trạng thái nhân viên
export const toggleEmployeeStatus = async (employee_id, currentStatus) => {
  try {
    const employeeRef = ref(database, `employees/${employee_id}`);
    const newStatus = !currentStatus;

    await update(employeeRef, { trangthai: newStatus });
    console.log(`Employee ${employee_id} status updated to ${newStatus ? "active" : "inactive"} successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employee_id} status:`, error);
    throw error;
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

// Read ChucVu
export const readChucVu = async () => {
  try {
    const db = getDatabase();
    const chucVuRef = ref(db, "chucvu");
    const snapshot = await get(chucVuRef);

    if (snapshot.exists()) {
      const chucVus = Object.keys(snapshot.val()).map((key) => ({
        id: key,
        ...snapshot.val()[key],
      }));

      return chucVus; // Return list of chucVu
    } else {
      console.log("No data available");
      return null; // No data found
    }
  } catch (error) {
    console.error("Error reading chuc vu data:", error);
    return null; // Handle error
  }
};

// Update ChucVu
export const updateChucVu = async (maChucVu, updatedData) => {
  try {
    const db = getDatabase();
    const chucVuRef = ref(db, `chucvu/${maChucVu}`);
    await update(chucVuRef, updatedData); // Update data at the specific location
    console.log(`Chức vụ ${maChucVu} đã được cập nhật thành công`);
  } catch (error) {
    console.error(`Lỗi khi cập nhật chức vụ ${maChucVu}:`, error);
  }
};

// Delete ChucVu
export const deleteChucVu = async (chucvu_id) => {
  try {
    const db = getDatabase();
    const chucVuRef = ref(db, `chucvu/${chucvu_id}`);
    await remove(chucVuRef); // Remove data at the specific location
    console.log(`Chức vụ ${chucvu_id} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa chức vụ ${chucvu_id}:`, error);
  }
};

// Ghi dữ liệu phòng ban
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

// Đọc danh sách phòng ban
export async function readPhongBan() {
  try {
    const snapshot = await get(ref(database, "phongban"));
    if (snapshot.exists()) {
      const phongBans = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
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

// Cập nhật phòng ban
export const editPhongBan = async (maPhongBan, updatedData) => {
  try {
    const phongBanRef = ref(database, `phongban/${maPhongBan}`);
    await update(phongBanRef, updatedData);
    console.log("Cập nhật phòng ban thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng ban:", error);
  }
};

// Xóa phòng ban
export const removePhongBan = async (maPhongBan) => {
  try {
    const phongBanRef = ref(database, `phongban/${maPhongBan}`);
    await remove(phongBanRef);
    console.log(`Phòng ban ${maPhongBan} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa phòng ban ${maPhongBan}:`, error);
  }
};

// Ghi dữ liệu bằng cấp
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
      const bangCaps = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
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

// Cập nhật bằng cấp
export async function updateBangCap(bangcapId, tenBang) {
  try {
    await update(ref(database, `bangcap/${bangcapId}`), { tenBang });
    console.log(`Bằng cấp ${bangcapId} updated successfully!`);
  } catch (error) {
    console.error(`Error updating bằng cấp ${bangcapId}:`, error);
  }
}

// Xóa bằng cấp
export const deleteBangCap = async (bangCap_id) => {
  try {
    const bangCapRef = ref(database, `bangcap/${bangCap_id}`);
    await remove(bangCapRef);
    console.log(`Bằng cấp ${bangCap_id} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa bằng cấp ${bangCap_id}:`, error);
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
