// app/services/database.js
import { getDatabase, ref, set } from "firebase/database";
import { app } from "../config/firebaseconfig";


const database = getDatabase(app);

export function writeUserData(userId, data) {
  set(ref(database, `chat/${userId}`), data)
    .then(() => {
      console.log("Data written successfully!");
    })
    .catch((error) => {
      console.error("Error writing data:", error);
    });
}
