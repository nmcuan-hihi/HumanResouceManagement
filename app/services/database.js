// app/services/database.js
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../config/firebaseconfig";

const database = getDatabase(app);

export function writeUserData(userId, data) {
  set(ref(database, `chat/${userId}`), data)
    .then(() => {
      console.log("User data written successfully!");
    })
    .catch((error) => {
      console.error("Error writing user data:", error);
    });
}

// Hàm để ghi danh sách nhân viên
export function writeEmployeeList(employees) {
  employees.forEach((employee) => {
    const employeeId = employee.employeeId; // Sử dụng employeeId trực tiếp
    
    set(ref(database, `employees/${employeeId}`), employee) // Ghi từng nhân viên
      .then(() => {
        console.log(`Employee ${employeeId} written successfully!`);
      })
      .catch((error) => {
        console.error(`Error writing employee ${employeeId}:`, error);
      });
  });
}
