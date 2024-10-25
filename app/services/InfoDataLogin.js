
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

// Hàm lấy thông tin nhân viên theo ID
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
  // Hàm lấy thông tin phòng ban theo ID
export const getPhongBanById = async (phongBanId) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `phongban/${phongBanId}`)); // Lấy dữ liệu từ node 'departments/{phongBanId}'

    if (snapshot.exists()) {
      const phongban = snapshot.val(); // Lấy dữ liệu và chuyển đổi thành đối tượng      
     
      return phongban; // Trả về thông tin nhân viên
    } else {
    
      return null; // Không tìm thấy nhân viên
    }
  } catch (error) {
    console.error("Error reading:", error);
  }
};