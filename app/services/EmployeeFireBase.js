import {
  getDatabase, ref, set, get, child, update, remove
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { store, storeHRM } from "../redux/store";

const database = getDatabase(app);
const storage = getStorage(app);

// Function to edit employee in Realtime Database
export const editEmployeeFireStore = async (updatedData, newProfileImage = null) => {
  const employeeId = updatedData.employeeId;

  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store
    const employeeRef = ref(database, `${idCty}/employees/${employeeId}`);

    // Check if a new image is provided
    let imageUrl = updatedData.imageUrl;
    if (newProfileImage) {
      const imageRef = storageRef(storage, `${idCty}/employee/${employeeId}.jpg`);
      const response = await fetch(newProfileImage);
      if (!response.ok) throw new Error("Failed to fetch new image");

      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      imageUrl = await getDownloadURL(imageRef);
    }

    const updatedEmployee = { ...updatedData, imageUrl };
    
    // Update the employee data in Realtime Database
    await update(employeeRef, updatedEmployee);

    console.log(`Employee ${employeeId} updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employeeId}:`, error);
    throw new Error("Failed to update employee!");
  }
};

// Function to add a new employee in Realtime Database
export const addEmployeeFireStore = async (employee, profileImage = null) => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store

    employee.employeeId = await getNewEmployeeId();
    employee.matKhau = employee.employeeId;
    const imageUrl = "";
    if(profileImage != null){
        // Reference for the image in storage
    const imageRef = storageRef(storage, `${idCty}/employee/${employee.employeeId}.jpg`);

    // Upload image
    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    // Get image URL
    imageUrl = await getDownloadURL(imageRef);
    }


   

    // Update employee data with image URL
    const emp = { ...employee, imageUrl };

    // Add employee to Realtime Database
    await set(ref(database, `${idCty}/employees/${employee.employeeId}`), emp);
    console.log("Employee successfully added to Realtime Database!");
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

// Function to read all employees from Realtime Database
export async function readEmployeesFireStore() {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store

    const employeeRef = ref(database, `${idCty}/employees`);
    const snapshot = await get(employeeRef);

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
    throw error;
  }
}
// hàm ;lấy nhân viên có chức vụ là trưởng phòng
export async function getEmployeesInSameDepartmentForHead(employeeId) {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy ID công ty từ Redux store
    const currentUser = state.congTy.employees[employeeId]; // Lấy thông tin người dùng hiện tại từ Redux store

    // Kiểm tra xem người dùng có tồn tại không
    if (!currentUser) {
      console.error("No current user found in the Redux store.");
      return null; // Hoặc xử lý lỗi này như mong muốn
    }

    // Tham chiếu đến bảng dữ liệu nhân viên trong Firebase
    const employeeRef = ref(database, `${idCty}/employees`);
    const snapshot = await get(employeeRef);

    if (snapshot.exists()) {
      const employees = [];

      // Lặp qua danh sách nhân viên để tìm những người cùng phòng ban với "Trưởng phòng"
      snapshot.forEach((childSnapshot) => {
        const employee = { id: childSnapshot.key, ...childSnapshot.val() };

        // Nếu người dùng hiện tại là "Trưởng phòng" (TP), tìm nhân viên cùng phòng ban
        if (currentUser.chucvuId === "TP" && employee.phongbanId === currentUser.phongbanId) {
          employees.push({ label: employee.name, value: employee.employeeId });
        }
      });

      // Nếu không tìm thấy nhân viên
      if (employees.length === 0) {
        console.log("No employees found in the same department.");
        return null;
      }

      return employees;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading employees:", error);
    throw error;
  }
}


// Function to get an employee by ID from Realtime Database
export async function getEmployeeById(employeeId) {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store
    console.log("ID Công ty:", idCty);

    console.log("Fetching employee with ID:", employeeId); // Debug log
    const employeeRef = ref(database, `${idCty}/employees/${employeeId}`);
 
    const snapshot = await get(employeeRef);

    if (snapshot.exists()) {
      console.log("Employee data found:", snapshot.val()); // Debug log
      return { id: employeeId, ...snapshot.val() };
    } else {
      console.log("No such employee!");
      return null;
    }
  } catch (error) {
    console.error("Error getting employee by ID:", error);
    throw error;
  }
}

// Function to generate new employee ID
export async function getNewEmployeeId() {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store

    const employeeRef = ref(database, `${idCty}/employees`);
    const snapshot = await get(employeeRef);

    let newId;
    if (snapshot.exists()) {
      const employees = [];
      snapshot.forEach((childSnapshot) => {
        employees.push(childSnapshot.key);
      });

      const latestId = Math.max(...employees.map(id => parseInt(id.slice(2)))) || 0;
      newId = `NV${(latestId + 1).toString().padStart(3, '0')}`;
    } else {
      newId = "NV000";
    }
    return newId;
  } catch (error) {
    console.error("Error fetching latest employee ID:", error);
    throw error;
  }
}
