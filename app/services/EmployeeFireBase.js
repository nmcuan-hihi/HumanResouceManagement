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

const database = getDatabase(app);
const storage = getStorage(app);

// Function to edit employee in Realtime Database
export const editEmployeeFireStore = async (updatedData, newProfileImage = null) => {
  const employeeId = updatedData.employeeId;

  console.log('Employee ID:', employeeId);
  console.log('Updated Data:', updatedData);

  try {
    const employeeRef = ref(database, `employees/${employeeId}`);

    // Check if a new image is provided
    let imageUrl = updatedData.imageUrl;
    if (newProfileImage) {
      const imageRef = storageRef(storage, `employee/${employeeId}.jpg`);
      const response = await fetch(newProfileImage);
      if (!response.ok) throw new Error('Failed to fetch new image');
      
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      imageUrl = await getDownloadURL(imageRef);
    }

    const updatedEmployee = { ...updatedData, imageUrl };
    
    console.log('Updated Employee Data:', updatedEmployee);

    // Update the employee data in Realtime Database
    await update(employeeRef, updatedEmployee);

    console.log(`Employee ${employeeId} updated successfully!`);
  } catch (error) {
    console.error(`Error updating employee ${employeeId}:`, error);
    throw new Error("Failed to update employee!");
  }
};

// Function to add a new employee in Realtime Database
export const addEmployeeFireStore = async (employee, profileImage) => {
  try {
    employee.employeeId = await getNewEmployeeId();
    employee.matKhau = employee.employeeId; 

    // Reference for the image in storage
    const imageRef = storageRef(storage, `employee/${employee.employeeId}.jpg`);

    // Upload image
    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    // Get image URL
    const imageUrl = await getDownloadURL(imageRef);

    // Update employee data with image URL
    const emp = { ...employee, imageUrl };

    // Add employee to Realtime Database
    await set(ref(database, `employees/${employee.employeeId}`), emp);
    console.log("Employee successfully added to Realtime Database!");
  } catch (error) {
    console.error("Error adding employee:", error);
  }
};

// Function to read all employees from Realtime Database
export async function readEmployeesFireStore() {
  try {
    const employeeRef = ref(database, "employees");
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

// Function to get employee by ID from Realtime Database
export async function getEmployeeById(employeeId) {
  try {
    const employeeRef = ref(database, `employees/${employeeId}`);
    const snapshot = await get(employeeRef);

    if (snapshot.exists()) {
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
    const employeeRef = ref(database, "employees");
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
