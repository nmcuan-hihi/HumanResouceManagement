// app/services/database.js
import { getDatabase, ref, set } from "firebase/database";
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


