import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
  child,
  push,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { app } from "../config/firebaseconfig";

const database = getDatabase(app); // Khởi tạo Realtime Database

export const getIdCtyData = async (id) => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const keys = Object.keys(data);

      if (keys.includes(id)) {
        return id; 
      } else {
        return null;
      }
    }
  } catch (error) {}
};
