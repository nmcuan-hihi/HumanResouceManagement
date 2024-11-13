import { getDatabase, ref, set, get, update, child, push, query, orderByChild, equalTo, onValue } from "firebase/database";
import { app } from "../config/firebaseconfig"; // Firebase configuration here
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Function to add a qualification for an employee, with image upload
export async function addBangCapNV(bangCap, image) {
  function random(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  const randomImg = random(20);
  try {
    // Create a reference to the image storage location
    const imageRef = storageRef(storage, `bangcap/${randomImg}.jpg`);

    // Upload the image
    const response = await fetch(image);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    // Get the image URL
    const imageUrl = await getDownloadURL(imageRef);

    // Add imageUrl to the data
    const data = { ...bangCap, imageUrl };

    // Write employee qualification data to Realtime Database
    await set(ref(database, `bangcapnhanvien/${bangCap.employeeId}-${bangCap.bangcap_id}`), data);
    console.log(`Employee ${bangCap.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Function to get qualification details of an employee based on bangcap_id and employeeId
export async function readBangCapNhanVien1(bangcap_id, employeeId) {
  try {
    const bangCapRef = query(
      ref(database, "bangcapnhanvien"),
      orderByChild("bangcap_id"),
      equalTo(bangcap_id)
    );

    const snapshot = await get(bangCapRef);

    if (snapshot.exists()) {
      let bangCapDetail = null;
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().employeeId === employeeId) {
          bangCapDetail = childSnapshot.val();
        }
      });
      return bangCapDetail ? bangCapDetail : {}; // Return found document or empty object
    } else {
      console.log("No document found with the provided bangcap_id and employeeId");
      return {}; // Return an empty object if no data found
    }
  } catch (error) {
    console.error("Error reading qualification by bangcap_id and employeeId:", error);
    return {}; // Return an empty object if an error occurs
  }
}

// Function to get all employee qualifications
export async function readBangCapNhanVien() {
  try {
    const bangCapRef = ref(database, "bangcapnhanvien");
    const snapshot = await get(bangCapRef);

    if (snapshot.exists()) {
      const bangcapnhanvien = {};
      snapshot.forEach((childSnapshot) => {
        bangcapnhanvien[childSnapshot.key] = childSnapshot.val();
      });
      return bangcapnhanvien;
    } else {
      console.log("No data available");
      return null; // Return null if no data is available
    }
  } catch (error) {
    console.error("Error reading employees:", error);
  }
}

// Real-time listener for employee qualifications
export function listenToBangCapNhanVienUpdates(callback) {
  const bangCapRef = ref(database, "bangcapnhanvien");

  onValue(bangCapRef, (snapshot) => {
    const bangcapnhanvien = {};
    snapshot.forEach((childSnapshot) => {
      bangcapnhanvien[childSnapshot.key] = childSnapshot.val();
    });
    callback(bangcapnhanvien);
  }, (error) => {
    console.error("Error listening to bangcapnhanvien updates:", error);
  });
}

// Function to toggle the verification status of a qualification
export async function toggleXacthuc(employeeId, bangcapId) {
  try {
    const bangCapRef = ref(database, `bangcapnhanvien/${employeeId}-${bangcapId}`);
    const snapshot = await get(bangCapRef);

    if (snapshot.exists()) {
      const currentXacthuc = snapshot.val().xacthuc;

      // Update the xacthuc value
      const newXacthuc = currentXacthuc === "0" ? "1" : "0";
      await update(bangCapRef, { xacthuc: newXacthuc });

      console.log(`Successfully updated xacthuc for ${employeeId} - ${bangcapId}:`, newXacthuc);
      return newXacthuc;
    } else {
      console.log("No document found to update!");
      return null;
    }
  } catch (error) {
    console.error("Error updating xacthuc:", error);
    return null;
  }
}
