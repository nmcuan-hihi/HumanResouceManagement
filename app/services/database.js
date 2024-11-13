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
const storage = getStorage(app); // Initialize Firebase Storage

// Function to add an employee to Firestore
export const addEmployeeFireStore = async (employee) => {
  try {
    const sanitizedEmployee = {};
    Object.keys(employee).forEach((key) => {
      if (employee[key] !== undefined) {
        sanitizedEmployee[key] = employee[key];
      }
    });

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

    const imageRef = storageRef(storage, `employee/${employeeData.employeeId}.jpg`);

    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    const imageUrl = await getDownloadURL(imageRef);
    const employee = { ...employeeData, imageUrl };

    await setDoc(doc(firestore, `employees/${employeeData.employeeId}`), employee);
    console.log(`Employee ${employeeData.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Function to read employee list
export async function readEmployees() {
  try {
    const employeeCollection = collection(firestore, "employees");
    const snapshot = await getDocs(employeeCollection);

    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading employees:", error);
  }
}

// Function to update employee info
export const updateEmployee = async (employee_id, employeeData) => {
  try {
    const employeeRef = doc(firestore, `employees/${employee_id}`);
    await updateDoc(employeeRef, employeeData);
    console.log(`Employee ${employee_id} updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employee_id}:`, error);
    throw error;
  }
};

// Function to delete employee
export const deleteEmployee = async (employee_id) => {
  try {
    const employeeRef = doc(firestore, `employees/${employee_id}`);
    await deleteDoc(employeeRef);
    console.log(`Employee ${employee_id} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting employee ${employee_id}:`, error);
    throw error;
  }
};

// Toggle employee status
export const toggleEmployeeStatus = async (employee_id, currentStatus) => {
  try {
    const employeeRef = doc(firestore, `employees/${employee_id}`);
    const newStatus = !currentStatus;
    await updateDoc(employeeRef, { trangthai: newStatus });
    console.log(`Employee ${employee_id} status updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employee_id} status:`, error);
    throw error;
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
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading phong ban:", error);
  }
}

// Position Functions (Chức vụ)
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
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading chuc vu data:", error);
    return null;
  }
};

// Update Chức vụ
export const updateChucVu = async (maChucVu, updatedData) => {
  try {
    const chucVuRef = doc(firestore, `chucvu/${maChucVu}`);
    await updateDoc(chucVuRef, updatedData);
    console.log(`Chức vụ ${maChucVu} đã được cập nhật thành công`);
  } catch (error) {
    console.error(`Lỗi khi cập nhật chức vụ ${maChucVu}:`, error);
  }
};

// Delete Chức vụ
export const deleteChucVu = async (chucvu_id) => {
  try {
    const chucVuRef = doc(firestore, `chucvu/${chucvu_id}`);
    await deleteDoc(chucVuRef);
    console.log(`Chức vụ ${chucvu_id} đã được xóa thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa chức vụ ${chucvu_id}:`, error);
  }
};

// Qualification Functions (Bằng cấp)
export function writeBangCap(bangCap) {
  const bangCapId = bangCap.bangcap_id;
  setDoc(doc(firestore, `bangcap/${bangCapId}`), bangCap)
    .then(() => {
      console.log(`Bằng cấp ${bangCapId} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing bằng cấp ${bangCapId}:`, error);
    });
}

export async function readBangCap() {
  try {
    const bangCapCollection = collection(firestore, "bangcap");
    const snapshot = await getDocs(bangCapCollection);

    if (!snapshot.empty) {
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading bang cap:", error);
  }
}

// Update Qualification (Bằng cấp)
export async function updateBangCap(bangcap_id, tenBang) {
  try {
    const bangCapRef = doc(firestore, `bangcap/${bangcap_id}`);
    await updateDoc(bangCapRef, { tenBang });
    console.log(`Bằng cấp ${bangcap_id} updated successfully!`);
  } catch (error) {
    console.error(`Error updating bằng cấp ${bangcap_id}:`, error);
  }
}

// Delete Qualification (Bằng cấp)
export async function deleteBangCap(bangCapId) {
  try {
    const bangCapRef = doc(firestore, `bangcap/${bangCapId}`);
    await deleteDoc(bangCapRef);
    console.log(`Bằng cấp ${bangCapId} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting bằng cấp ${bangCapId}:`, error);
  }
}

export const getEmployeeById = async (employeeId) => {
  try {
    const employeeRef = doc(firestore, `employees/${employeeId}`);
    const snapshot = await getDoc(employeeRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    console.log(`Employee with ID ${employeeId} not found`);
    return null;
  } catch (error) {
    console.error("Error retrieving employee:", error);
  }
};
