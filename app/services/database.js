import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
} from "firebase/database";
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
export async function addEmployee(employeeData, profileImage) {
  try {
    const employeeId = employeeData.employeeId;
    const dbRef = ref(database, `employees/${employeeId}`);
    await set(dbRef, employeeData);

    // Upload profile image to Firebase Storage
    const imageRef = storageRef(storage, `employee/${employeeData.employeeId}.jpg`);
    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    // Get download URL and update employee data
    const imageUrl = await getDownloadURL(imageRef);
    await update(dbRef, { imageUrl });

    console.log(`Employee ${employeeData.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Function to read employee list
export async function readEmployees() {
  try {
    const dbRef = ref(database, "employees");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const employees = [];
      snapshot.forEach((childSnapshot) => {
        employees.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
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
    const dbRef = ref(database, `employees/${employeeId}`);
    await update(dbRef, employeeData);
    console.log(`Employee ${employeeId} updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employeeId}:`, error);
  }
};

// Function to delete employee
export const deleteEmployee = async (employeeId) => {
  try {
    const dbRef = ref(database, `employees/${employeeId}`);
    await remove(dbRef);
    console.log(`Employee ${employeeId} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting employee ${employeeId}:`, error);
  }
};

// Toggle employee status
export const toggleEmployeeStatus = async (employeeId, currentStatus) => {
  try {
    const dbRef = ref(database, `employees/${employeeId}`);
    const newStatus = !currentStatus;
    await update(dbRef, { trangthai: newStatus });
    console.log(`Employee ${employeeId} status updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employeeId} status:`, error);
  }
};

// Function to write Phong Ban (Department)
export function writePhongBan(phongBan) {
  const dbRef = ref(database, `phongban/${phongBan.maPhongBan}`);
  set(dbRef, phongBan)
    .then(() => {
      console.log(`Phòng ban ${phongBan.maPhongBan} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing phòng ban ${phongBan.maPhongBan}:`, error);
    });
}

// Function to read Phong Ban list
export async function readPhongBan() {
  try {
    const dbRef = ref(database, "phongban");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const phongBanList = [];
      snapshot.forEach((childSnapshot) => {
        phongBanList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      return phongBanList;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading phong ban:", error);
  }
}

// Function to create Chuc Vu (Position)
export const createChucVu = async (chucvu_id, chucVu) => {
  try {
    const dbRef = ref(database, `chucvu/${chucvu_id}`);
    await set(dbRef, chucVu);
    console.log(`Chức vụ ${chucvu_id} added successfully!`);
  } catch (error) {
    console.error(`Error adding chức vụ ${chucvu_id}:`, error);
  }
};

// Function to read Chuc Vu list
export const readChucVu = async () => {
  try {
    const dbRef = ref(database, "chucvu");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const chucVuList = [];
      snapshot.forEach((childSnapshot) => {
        chucVuList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      return chucVuList;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading chuc vu data:", error);
  }
};

// Function to update Chuc Vu (Position)
export const updateChucVu = async (maChucVu, updatedData) => {
  try {
    const dbRef = ref(database, `chucvu/${maChucVu}`);
    await update(dbRef, updatedData);
    console.log(`Chức vụ ${maChucVu} updated successfully!`);
  } catch (error) {
    console.error(`Error updating chức vụ ${maChucVu}:`, error);
  }
};

// Function to delete Chuc Vu (Position)
export const deleteChucVu = async (chucvu_id) => {
  try {
    const dbRef = ref(database, `chucvu/${chucvu_id}`);
    await remove(dbRef);
    console.log(`Chức vụ ${chucvu_id} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting chức vụ ${chucvu_id}:`, error);
  }
};

// Function to write Bang Cap (Qualification)
export function writeBangCap(bangCap) {
  const dbRef = ref(database, `bangcap/${bangCap.bangcap_id}`);
  set(dbRef, bangCap)
    .then(() => {
      console.log(`Bằng cấp ${bangCap.bangcap_id} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing bằng cấp ${bangCap.bangcap_id}:`, error);
    });
}

// Function to read Bang Cap list
export async function readBangCap() {
  try {
    const dbRef = ref(database, "bangcap");
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const bangCapList = [];
      snapshot.forEach((childSnapshot) => {
        bangCapList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      return bangCapList;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading bang cap:", error);
  }
}

// Function to update Bang Cap (Qualification)
export async function updateBangCap(bangcap_id, tenBang) {
  try {
    const dbRef = ref(database, `bangcap/${bangcap_id}`);
    await update(dbRef, { tenBang });
    console.log(`Bằng cấp ${bangcap_id} updated successfully!`);
  } catch (error) {
    console.error(`Error updating bằng cấp ${bangcap_id}:`, error);
  }
}

// Function to delete Bang Cap (Qualification)
export async function deleteBangCap(bangCapId) {
  try {
    const dbRef = ref(database, `bangcap/${bangCapId}`);
    await remove(dbRef);
    console.log(`Bằng cấp ${bangCapId} deleted successfully!`);
  } catch (error) {
    console.error(`Error deleting bằng cấp ${bangCapId}:`, error);
  }
}

// Function to get employee by ID
export const getEmployeeById = async (employeeId) => {
  try {
    const dbRef = ref(database, `employees/${employeeId}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return { id: employeeId, ...snapshot.val() };
    }
    console.log(`Employee with ID ${employeeId} not found`);
    return null;
  } catch (error) {
    console.error("Error retrieving employee:", error);
  }
};
