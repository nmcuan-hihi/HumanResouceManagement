import { getDatabase, ref, get, child } from "firebase/database";
import { app } from "../config/firebaseconfig";

const database = getDatabase(app);

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

// Hàm đọc danh sách nhân viên
export async function readEmployees() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'employees')); // Lấy dữ liệu từ node 'employees'

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
