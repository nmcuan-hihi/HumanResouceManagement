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
  deleteDoc,
} from "firebase/firestore";
const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage

// Hàm ghi dữ liệu nhân viên vào Firestore
export const addEmployeeFireStore = async (employee) => {
  try {
    // Loại bỏ các trường có giá trị undefined
    const sanitizedEmployee = {};
    Object.keys(employee).forEach((key) => {
      if (employee[key] !== undefined) {
        sanitizedEmployee[key] = employee[key];
      }
    });

    // Thêm nhân viên vào Firestore với employeeId làm ID
    await setDoc(
      doc(firestore, "employees", employee.employeeId),
      sanitizedEmployee
    );
    console.log("Employee successfully added to Firestore!");
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

export function writeUserData(employee) {
  const employeeId = employee.employeeId;

  setDoc(doc(firestore, `employees/${employeeId}`), employee)
    .then(() => {
      console.log(`Employee ${employeeId} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing employee ${employeeId}:`, error);
    });
}

export async function addEmployee(employeeData, profileImage) {
  try {
    employeeData.matKhau = employeeData.employeeId;

    // Tạo tham chiếu tới nơi lưu trữ hình ảnh
    const imageRef = storageRef(
      storage,
      `employee/${employeeData.employeeId}.jpg`
    );

    // Tải lên hình ảnh
    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    // Lấy URL hình ảnh
    const imageUrl = await getDownloadURL(imageRef);

    // Cập nhật imageUrl vào employeeData
    const employee = { ...employeeData, imageUrl };

    // Ghi dữ liệu nhân viên vào Firestore
    await setDoc(
      doc(firestore, `employees/${employeeData.employeeId}`),
      employee
    );
    console.log(`Employee ${employeeData.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Hàm đọc danh sách nhân viên

export async function readEmployees() {
  try {
    const employeeCollection = collection(firestore, "employees");
    const snapshot = await getDocs(employeeCollection);

    if (!snapshot.empty) {
      const employees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
    const employeeRef = doc(firestore, `employees/${employee_id}`);
    await updateDoc(employeeRef, employeeData);
    console.log(`Employee ${employee_id} updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employee_id}:`, error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

export const deleteEmployee = async (employee_id) => {
  try {
    const employeeRef = doc(firestore, `employees/${employee_id}`);
    await deleteDoc(employeeRef);
    console.log(`Employee ${employee_id} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting employee ${employee_id}:`, error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

// Hàm chuyển đổi trạng thái nhân viên
export const toggleEmployeeStatus = async (employee_id, currentStatus) => {
  try {
    const employeeRef = doc(firestore, `employees/${employee_id}`);
    const newStatus = !currentStatus;

    // Cập nhật trạng thái mới
    await updateDoc(employeeRef, {
      trangthai: newStatus,
    });

    console.log(
      `Employee ${employee_id} status updated to ${
        newStatus ? "active" : "inactive"
      } successfully!`
    );
  } catch (error) {
    console.error(`Error updating employee ${employee_id} status:`, error);
    throw error; // Ném lỗi để xử lý ở component
  }
};

export function writePhongBan(phongBan) {
  const maPhongBan = phongBan.maPhongBan;

  setDoc(doc(firestore, `phongban/${maPhongBan}`), phongBan)
    .then(() => {
      console.log(`Phòng ban ${maPhongBan} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing phòng ban ${maPhongBan}:`, error);
    });
}

export async function readPhongBan() {
  try {
    const phongBanCollection = collection(firestore, "phongban");
    const snapshot = await getDocs(phongBanCollection);

    if (!snapshot.empty) {
      const phongBans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
    const phongBanCollection = collection(firestore, "phongban");
    const snapshot = await getDocs(phongBanCollection);

    if (!snapshot.empty) {
      const phongBans = snapshot.docs.map((doc) => ({
        maPhongBan: doc.id, // Lấy ID phòng ban
        ...doc.data(), // Lấy dữ liệu phòng ban
      }));

      return phongBans; // Trả về danh sách phòng ban
    } else {
      console.log("No data available");
      return []; // Trả về mảng rỗng nếu không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading phong ban:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
}
export const createChucVu = async (chucvu_id, chucVu) => {
  try {
    const chucVuRef = doc(firestore, `chucvu/${chucvu_id}`);
    await setDoc(chucVuRef, chucVu);
    console.log(`Chức vụ ${chucvu_id} đã được thêm thành công`);
  } catch (error) {
    console.error(`Lỗi khi thêm chức vụ ${chucvu_id}:`, error);
  }
};

export const readChucVu = async () => {
  try {
    const chucVuCollection = collection(firestore, "chucvu");
    const snapshot = await getDocs(chucVuCollection);

    if (!snapshot.empty) {
      const chucVus = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return chucVus; // Trả về danh sách chức vụ
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading chuc vu data:", error);
    return null; // Xử lý lỗi
  }
};

export const updateChucVu = async (maChucVu, updatedData) => {
  try {
    const chucVuRef = doc(firestore, `chucvu/${maChucVu}`); // Tham chiếu tới chức vụ
    await updateDoc(chucVuRef, updatedData); // Cập nhật dữ liệu
    console.log(`Chức vụ ${maChucVu} đã được cập nhật thành công`);
  } catch (error) {
    console.error(`Lỗi khi cập nhật chức vụ ${maChucVu}:`, error);
  }
};

// Hàm xóa chức vụ

export const deleteChucVu = async (chucvu_id) => {
  try {
    const chucVuRef = doc(firestore, `chucvu/${chucvu_id}`); // Tham chiếu tới chức vụ cần xóa
    await deleteDoc(chucVuRef); // Xóa chức vụ
    console.log(`Chức vụ ${chucvu_id} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa chức vụ ${chucvu_id}:`, error);
  }
};

export const editPhongBan = async (maPhongBan, updatedData) => {
  try {
    const phongBanRef = doc(firestore, `phongban/${maPhongBan}`); // Tham chiếu tới phòng ban
    await updateDoc(phongBanRef, updatedData); // Cập nhật dữ liệu
    console.log("Cập nhật phòng ban thành công");
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng ban:", error);
  }
};

export const removePhongBan = async (maPhongBan) => {
  try {
    const phongBanRef = doc(firestore, `phongban/${maPhongBan}`); // Tham chiếu tới phòng ban cần xóa
    await deleteDoc(phongBanRef); // Xóa phòng ban
    console.log(`Phòng ban ${maPhongBan} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa phòng ban ${maPhongBan}:`, error);
  }
};

// bằng cấp
// Hàm ghi dữ liệu bằng cấp

export function writeBangCap(bangCap) {
  const bangCapId = bangCap.bangcap_id; // Lấy ID bằng cấp

  setDoc(doc(firestore, `bangcap/${bangCapId}`), bangCap) // Lưu vào node 'bangcap'
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
    const bangCapCollection = collection(firestore, "bangcap"); // Tham chiếu tới collection 'bangcap'
    const snapshot = await getDocs(bangCapCollection); // Lấy dữ liệu

    if (!snapshot.empty) {
      const bangCaps = snapshot.docs.map((doc) => ({
        id: doc.id, // Lấy ID bằng cấp
        ...doc.data(), // Lấy dữ liệu bằng cấp
      }));

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

export async function deleteBangCap(bangCapId) {
  try {
    const bangCapRef = doc(firestore, `bangcap/${bangCapId}`); // Tham chiếu tới bằng cấp cần xóa
    await deleteDoc(bangCapRef); // Xóa bằng cấp
    console.log(`Bằng cấp ${bangCapId} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting bằng cấp ${bangCapId}:`, error);
  }
}
// Hàm sửa dữ liệu bằng cấp
export async function updateBangCap(bangcap_id, tenBang) {
  try {
    const bangCapRef = doc(firestore, `bangcap/${bangcap_id}`); // Tham chiếu tới bằng cấp
    await updateDoc(bangCapRef, { tenBang }); // Cập nhật dữ liệu vào node 'bangcap'
    console.log(`Bằng cấp ${bangcap_id} updated successfully!`);
  } catch (error) {
    console.error(`Error updating bằng cấp ${bangcap_id}:`, error);
  }
}

export const getEmployeeById = async (employeeId) => {
  try {
    const employeeRef = doc(firestore, `employees/${employeeId}`); // Tham chiếu tới nhân viên theo ID
    const snapshot = await getDoc(employeeRef); // Lấy dữ liệu từ document

    if (snapshot.exists()) {
      const employee = snapshot.data(); // Lấy dữ liệu và chuyển đổi thành đối tượng
      return employee; // Trả về thông tin nhân viên
    } else {
      console.log("No employee found with ID:", employeeId);
      return null; // Không tìm thấy nhân viên
    }
  } catch (error) {
    console.error("Error reading employee---:", error);
  }
};
