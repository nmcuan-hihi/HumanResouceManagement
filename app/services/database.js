import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  push,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import { store } from "../redux/store"; // Import Redux store to access idCty
const database = getDatabase(app); // Khởi tạo Realtime Database

// Hàm ghi dữ liệu nhân viên vào Realtime Database
export const addEmployeeFireStore = async (employee) => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const sanitizedEmployee = {};
    Object.keys(employee).forEach((key) => {
      if (employee[key] !== undefined) {
        sanitizedEmployee[key] = employee[key];
      }
    });

    await set(ref(database, `${idCty}/employees/${employee.employeeId}`), sanitizedEmployee);
    console.log("Employee successfully added to Realtime Database!");
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

// Ghi dữ liệu nhân viên
export function writeUserData(employee) {
  const state = store.getState();
  const idCty = state.congTy.idCty;
  const employeeId = employee.employeeId;
  set(ref(database, `${idCty}/employees/${employeeId}`), employee)
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
    const state = store.getState();
    const idCty = state.congTy.idCty;
    employeeData.matKhau = employeeData.employeeId;
    const imageRef = ref(database, `${idCty}/employeeImages/${employeeData.employeeId}.jpg`);

    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    const imageUrl = await getDownloadURL(imageRef);
    const employee = { ...employeeData, imageUrl };
    await set(ref(database, `${idCty}/employees/${employeeData.employeeId}`), employee);
    console.log(`Employee ${employeeData.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Đọc danh sách nhân viên
export async function readEmployees() {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const snapshot = await get(ref(database, `${idCty}/employees`));
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
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const employeeRef = ref(database, `${idCty}/employees/${employee_id}`);
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
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const employeeRef = ref(database, `${idCty}/employees/${employee_id}`);
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
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const employeeRef = ref(database, `${idCty}/employees/${employee_id}`);
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
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const chucVuRef = ref(database, `${idCty}/chucvu/${chucvu_id}`);
    await set(chucVuRef, chucVu); // Set data at the specific location
    console.log(`Chức vụ ${chucvu_id} đã được thêm thành công`);
  } catch (error) {
    console.error(`Lỗi khi thêm chức vụ ${chucvu_id}:`, error);
  }
};

// Read ChucVu
export const readChucVu = async () => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const chucVuRef = ref(database, `${idCty}/chucvu`);
    const snapshot = await get(chucVuRef);

    if (snapshot.exists()) {
      const chucVus = Object.keys(snapshot.val())
        .map((key) => ({
          id: key,
          ...snapshot.val()[key],
        }))
        .filter((item) => item.chucvu_id !== "GD"); // Loại bỏ chucvu_id = GD

      return chucVus; // Return filtered list of chucVu
    } else {
      console.log("No data available");
      return null; // No data found
    }
  } catch (error) {
    console.error("Error reading chuc vu data:", error);
    return null; // Handle error
  }
};

export const readChucVu1 = async () => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const chucVuRef = ref(database, `${idCty}/chucvu`);
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
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const chucVuRef = ref(database, `${idCty}/chucvu/${maChucVu}`);
    await update(chucVuRef, updatedData); // Update data at the specific location
    console.log(`Chức vụ ${maChucVu} đã được cập nhật thành công`);
  } catch (error) {
    console.error(`Lỗi khi cập nhật chức vụ ${maChucVu}:`, error);
  }
};

// Delete ChucVu
export const deleteChucVu = async (chucvu_id) => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const chucVuRef = ref(database, `${idCty}/chucvu/${chucvu_id}`);
    await remove(chucVuRef); // Remove data at the specific location
    console.log(`Chức vụ ${chucvu_id} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa chức vụ ${chucvu_id}:`, error);
  }
};

// Ghi dữ liệu phòng ban
export function writePhongBan(phongBan) {
  const state = store.getState();
  const idCty = state.congTy.idCty;
  const maPhongBan = phongBan.maPhongBan;
  set(ref(database, `${idCty}/phongban/${maPhongBan}`), phongBan)
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
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const snapshot = await get(ref(database, `${idCty}/phongban`));
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
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const phongBanRef = ref(database, `${idCty}/phongban/${maPhongBan}`);
    await update(phongBanRef, updatedData);
    console.log("Cập nhật phòng ban thành công");
  } catch (error) {
    console.error("Error updating phòng ban:", error);
  }
};

// Xóa phòng ban
export const removePhongBan = async (maPhongBan) => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty;
    const phongBanRef = ref(database, `${idCty}/phongban/${maPhongBan}`);
    await remove(phongBanRef);
    console.log("Xóa phòng ban thành công");
  } catch (error) {
    console.error("Error deleting phòng ban:", error);
  }
};


// Ghi dữ liệu bằng cấp
export function writeBangCap(bangCap) {
  // Lấy idCty từ store bên trong hàm
  const state = store.getState();
  const idCty = state.congTy.idCty;
  
  const bangCapId = bangCap.bangcap_id;
  set(ref(database, `/${idCty}/bangcap/${bangCapId}`), bangCap)
    .then(() => {
      console.log(`Bằng cấp ${bangCapId} cho công ty ${idCty} đã được ghi thành công!`);
    })
    .catch((error) => {
      console.error(`Lỗi khi ghi bằng cấp ${bangCapId} cho công ty ${idCty}:`, error);
    });
}

// Đọc danh sách bằng cấp
export async function readBangCap() {
  try {
    // Lấy idCty từ store bên trong hàm
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    const snapshot = await get(ref(database, `/${idCty}/bangcap`));
    if (snapshot.exists()) {
      const bangCaps = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
      }));
      return bangCaps;
    } else {
      console.log("Không có dữ liệu bằng cấp cho công ty này");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi đọc danh sách bằng cấp:", error);
  }
}

// Cập nhật bằng cấp
export async function updateBangCap(bangcapId, tenBang) {
  try {
    // Lấy idCty từ store bên trong hàm
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    await update(ref(database, `/${idCty}/bangcap/${bangcapId}`), { tenBang });
    console.log(`Bằng cấp ${bangcapId} cho công ty ${idCty} đã được cập nhật thành công!`);
  } catch (error) {
    console.error(`Lỗi khi cập nhật bằng cấp ${bangcapId} cho công ty ${idCty}:`, error);
  }
}

// Xóa bằng cấp
export const deleteBangCap = async (bangCap_id) => {
  try {
    // Lấy idCty từ store bên trong hàm
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    const bangCapRef = ref(database, `/${idCty}/bangcap/${bangCap_id}`);
    await remove(bangCapRef);
    console.log(`Bằng cấp ${bangCap_id} cho công ty ${idCty} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa bằng cấp ${bangCap_id} cho công ty ${idCty}:`, error);
  }
};

// Lấy danh sách nhân viên theo phòng ban
export async function readEmployeesByPhongBan(phongBanId) {
  try {
    // Lấy idCty từ store bên trong hàm
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    const employeeRef = query(
      ref(database, `/${idCty}/employees`),
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
      console.log("Không có nhân viên trong phòng ban này của công ty");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi đọc danh sách nhân viên theo phòng ban và công ty:", error);
  }
}

// Thêm thông tin chấm công vào Realtime Database
export async function addChamCong(chamCongData) {
  try {
    // Lấy idCty từ store bên trong hàm
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    const newChamCongRef = push(ref(database, `/${idCty}/chamcong`));
    await set(newChamCongRef, chamCongData);
    console.log("Thông tin chấm công cho công ty đã được thêm thành công!");
  } catch (error) {
    console.error("Lỗi khi thêm thông tin chấm công cho công ty:", error);
  }
}

// Đọc danh sách chấm công
export async function readChamCong() {
  try {
    // Lấy idCty từ store bên trong hàm
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    const snapshot = await get(ref(database, `/${idCty}/chamcong`));
    if (snapshot.exists()) {
      const chamCong = Object.entries(snapshot.val()).map(([id, data]) => ({
        id,
        ...data,
      }));
      return chamCong;
    } else {
      console.log("Không có dữ liệu chấm công cho công ty");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi đọc danh sách chấm công cho công ty:", error);
  }
}