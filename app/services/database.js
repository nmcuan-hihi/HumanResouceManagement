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

// them chuc vu
export const createChucVu = async (chucVu) => {
  try {
    const docRef = await db.collection('chucvu').add(chucVu);
    return docRef.id; // Trả về ID của chức vụ đã được thêm
  } catch (error) {
    console.error("Error adding chuc vu: ", error);
    throw error;
  }
};
export const readChucVu = async () => {
  try {
    const snapshot = await get(ref(database, 'chucvu')); // Đọc dữ liệu từ node 'chucvu'
    if (snapshot.exists()) {
      return snapshot.val(); // Trả về dữ liệu nếu tồn tại
    } else {
      console.log('No data available');
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error('Error reading chuc vu data:', error);
    return null; // Xử lý lỗi
  }
};
export const updateChucVu = async (chucvuId, updatedData) => {
  try {
    await db.collection('chucvu').doc(chucvuId).update(updatedData);
  } catch (error) {
    console.error("Error updating chuc vu: ", error);
    throw error;
  }
};
export const deleteChucVu = async (chucvuId) => {
  try {
    await db.collection('chucvu').doc(chucvuId).delete();
  } catch (error) {
    console.error("Error deleting chuc vu: ", error);
    throw error;
  }
};


export const readAllSkill = async () => {
  try {
    const snapshot = await get(ref(database, 'skills')); // Đọc dữ liệu từ node 'skills'
    if (snapshot.exists()) {
      return snapshot.val(); // Trả về dữ liệu nếu tồn tại
    } else {
      console.log('No data available');
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error('Error reading skill data:', error);
    return null;
  }
};

// thêm skill

export function writeSkill(skill) {
  const { mask, tensk } = skill;

  // Construct the data object to be written to Firebase
  const skillData = {
    mask: mask,
    tensk: tensk
  };

  // Set the data at the specified location in Firebase database
  set(ref(database, `skills/${mask}`), skillData)
    .then(() => {
      console.log(`Skill ${tensk} with mask ${mask} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing skill ${mask}:`, error);
    });
}

//đọc skill
export async function readSkill(mask) {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `skills/${mask}`));

    if (snapshot.exists()) {
      const skillData = snapshot.val();
      console.log("Skill data:", skillData);
      return skillData; // Trả về dữ liệu skill cụ thể
    } else {
      console.log("No data available for this skill.");
      return null;
    }
  } catch (error) {
    console.error("Error reading skill:", error);
  }
}

///edit skill
export async function editSkill(mask, updatedSkill) {
  try {
    const skillRef = ref(database, `skills/${mask}`);
    await update(skillRef, updatedSkill);
    console.log('Skill updated successfully!');
  } catch (error) {
    console.error('Error updating skill:', error);
  }
}

//xoa skill
export async function removeSkill(mask) {
  try {
    const skillRef = ref(database, `skills/${mask}`);
    await remove(skillRef);
    console.log('Skill removed successfully!');
  } catch (error) {
    console.error('Error removing skill:', error);
  }
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
      console.log("Employees data:", employees);
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
      console.log("Phong ban data:", phongBans);
      return phongBans; // Trả về danh sách phòng ban
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
