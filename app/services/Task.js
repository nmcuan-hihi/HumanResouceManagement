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

  