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
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage
export function writeUserData(employee) {
  const employeeId = employee.employeeId; // Sử dụng employeeId

  set(ref(database, `employees/${employeeId}`), employee)
    .then(() => {
      console.log(`Employee ${employeeId} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing employee ${employeeId}:`, error);
    });
}
export async function addEmployee(employeeData, profileImage) {
  try {
    employeeData.matKhau = employeeData.employeeId
    // Tạo tham chiếu tới nơi lưu trữ hình ảnh
    const imageRef = storageRef(storage, `employee/${employeeData.employeeId}.jpg`);

    // Tải lên hình ảnh
    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    // Lấy URL hình ảnh
    const imageUrl = await getDownloadURL(imageRef);

    // Cập nhật imageUrl vào employeeData
    const employee = { ...employeeData, imageUrl };

    // Ghi dữ liệu nhân viên vào Realtime Database
    await set(ref(database, `employees/${employeeData.employeeId}`), employee);
    console.log(`Employee ${employeeData.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}
// Hàm đọc danh sách nhân viên
export async function readEmployees() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "employees")); // Lấy dữ liệu từ node 'employees'

    if (snapshot.exists()) {
      const employees = snapshot.val(); // Lấy dữ liệu và chuyển đổi thành đối tượng
     
      return employees; // Trả về danh sách nhân viên
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading employees:", error);
  }
}

// Hàm cập nhật thông tin nhân viên
export const updateEmployee = async (employee_id, employeeData) => {
  try {
    const employeeRef = ref(database, `employees/${employee_id}`); // Đường dẫn đến nhân viên cần cập nhật
    await update(employeeRef, employeeData); // Cập nhật dữ liệu nhân viên
    console.log(`Employee ${employee_id} updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employee_id}:`, error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

// Hàm xóa nhân viên
export const deleteEmployee = async (employee_id) => {
  try {
    const employeeRef = ref(database, `employees/${employee_id}`); // Đường dẫn đến nhân viên cần xóa
    await remove(employeeRef); // Xóa nhân viên khỏi Firebase
    console.log(`Employee ${employee_id} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting employee ${employee_id}:`, error);
    throw error; // Ném lỗi để xử lý ở component
  }
};
// Hàm chuyển đổi trạng thái nhân viên
export const toggleEmployeeStatus = async (employee_id, currentStatus) => {
  try {
    const employeeRef = ref(database, `employees/${employee_id}`); // Đường dẫn đến nhân viên cần cập nhật
    const newStatus = !currentStatus; // Đảo ngược trạng thái

    // Cập nhật trạng thái mới
    await update(employeeRef, {
      trangthai: newStatus,
    });

    console.log(`Employee ${employee_id} status updated to ${newStatus ? 'active' : 'inactive'} successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employee_id} status:`, error);
    throw error; // Ném lỗi để xử lý ở component
  }
};


export function writeEmployeeData(employee) {
  console.log("Employee data:", employee); // In ra dữ liệu nhân viên để kiểm tra

  // Kiểm tra từng thuộc tính trong đối tượng employee
  const requiredFields = [
    "employee_id",
    "cccd",
    "chucvu_id",
    "luongcoban_id",
    "name",
    "ngaybatdau",
    "ngaysinh",
    "phongban_id",
    "sdt",
    "trangthai",
  ];

  for (const field of requiredFields) {
    if (employee[field] === undefined) {
      console.error(`Field ${field} is undefined`);
      return; // Ngưng thực hiện nếu một trường bắt buộc không có giá trị
    }
  }

  const employeeId = employee.employeeId; // Lấy ID nhân viên
  if (!employeeId) {
    console.error("Employee ID is undefined");
    return; // Ngưng thực hiện nếu employeeId không hợp lệ
  }

  // Ghi dữ liệu vào Firebase
  set(ref(database, `employees/${employeeId}`), employee)
    .then(() => {
      console.log(`Employee ${employeeId} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing employee ${employeeId}:`, error);
    });
}

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

export async function readPhongBan() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "phongban"));

    if (snapshot.exists()) {
      const phongBans = snapshot.val(); // Lấy dữ liệu và chuyển đổi thành đối tượng
     
      return phongBans; // Trả về danh sách phòng ban
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading phong ban:", error);
  }
}
export async function readPhongBan1() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "phongban"));

    if (snapshot.exists()) {
      const phongBans = snapshot.val(); // Lấy dữ liệu
      // Chuyển đổi thành mảng
      return Object.keys(phongBans).map(key => ({
        maPhongBan: key,
        tenPhongBan: phongBans[key].tenPhongBan
      }));
    } else {
      console.log("No data available");
      return []; // Trả về mảng rỗng nếu không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading phong ban:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
}


export async function readChucVu() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "chucvu"));

    if (snapshot.exists()) {
      const ChucVus = snapshot.val(); // Lấy dữ liệu và chuyển đổi thành đối tượng
      console.log("Chuc Vu data:", ChucVus);
      return ChucVus; // Trả về danh sách phòng ban
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading phong ban:", error);
  }
}
export const editPhongBan = async (maPhongBan, updatedData) => {
  try {
    const phongBanRef = ref(database, `phongban/${maPhongBan}`); // Sử dụng ref từ database
    await update(phongBanRef, updatedData); // Sử dụng hàm update
    console.log("Cập nhật phòng ban thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng ban:", error);
  }
};

export const removePhongBan = async (maPhongBan) => {
  try {
    const phongBanRef = ref(database, `phongban/${maPhongBan}`); // Đường dẫn tới phòng ban cần xóa
    await remove(phongBanRef); // Xóa phòng ban
    console.log(`Phòng ban ${maPhongBan} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa phòng ban ${maPhongBan}:`, error);
  }
};

// bằng cấp
// Hàm ghi dữ liệu bằng cấp
export function writeBangCap(bangCap) {
  const bangCapId = bangCap.bangcap_id; // Lấy ID bằng cấp

  set(ref(database, `bangcap/${bangCapId}`), bangCap) // Lưu vào node 'bangcap'
    .then(() => {
      console.log(`Bằng cấp ${bangCapId} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing bằng cấp ${bangCapId}:`, error);
    });
}

// Hàm đọc danh sách bằng cấp
export async function readBangCap() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, "bangcap")); // Lấy dữ liệu từ node 'bangcap'

    if (snapshot.exists()) {
      const bangCaps = snapshot.val(); // Chuyển dữ liệu thành đối tượng
      console.log("Bang cap data:", bangCaps);
      return bangCaps; // Trả về danh sách bằng cấp
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading bang cap:", error);
  }
}

// Hàm xóa bằng cấp
export function deleteBangCap(bangCapId) {
  set(ref(database, `bangcap/${bangCapId}`), null) // Xóa node 'bangcap' với ID tương ứng
    .then(() => {
      console.log(`Bằng cấp ${bangCapId} deleted successfully!`);
    })
    .catch((error) => {
      console.error(`Error deleting bằng cấp ${bangCapId}:`, error);
    });
}

// Hàm sửa dữ liệu bằng cấp
export function updateBangCap(bangcap_id, tenBang) {
  update(ref(database, `bangcap/${bangcap_id}`),{tenBang}) // Cập nhật dữ liệu vào node 'bangcap'
    .then(() => {
      console.log(`Bằng cấp ${bangcap_id} updated successfully!`);
    })
    .catch((error) => {
      console.error(`Error updating bằng cấp ${bangcap_id}:`, error);
    });
}


export const getEmployeeById = async (employeeId) => {
  try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `employees/${employeeId}`)); // Lấy dữ liệu từ node 'employees/{employeeId}'
  
      if (snapshot.exists()) {
        const employee = snapshot.val(); // Lấy dữ liệu và chuyển đổi thành đối tượng      
        // console.log("Employee Data:", JSON.stringify(employee, null, 2));
        return employee; // Trả về thông tin nhân viên
      } else {
        console.log("No employee found with ID:", employeeId);
        return null; // Không tìm thấy nhân viên
      }
    } catch (error) {
      console.error("Error reading employee:", error);
    }
};
