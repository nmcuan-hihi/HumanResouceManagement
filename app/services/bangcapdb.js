import { getDatabase, ref, set, get, update, query, equalTo, orderByChild, child } from "firebase/database";
import { app } from "../config/firebaseconfig"; // Assumes your Firebase configuration is here
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Helper function to generate random string
function random(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

// Add employee qualification with image
export async function addBangCapNV(bangCap, image) {
  const randomImg = random(20);
  try {
    const imageRef = storageRef(storage, `bangcap/${randomImg}.jpg`);
    const response = await fetch(image);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);

    const data = { ...bangCap, imageUrl };
    await set(ref(database, `bangcapnhanvien/${bangCap.employeeId}-${bangCap.bangcap_id}`), data);
    console.log(`Employee ${bangCap.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
}

// Fetch qualification details by bangcap_id and employeeId
export async function readBangCapNhanVien1(bangcap_id, employeeId) {
  try {
    const bangCapRef = query(ref(database, "bangcapnhanvien"), orderByChild("bangcap_id"), equalTo(bangcap_id));
    const snapshot = await get(bangCapRef);

    if (snapshot.exists()) {
      let bangCapDetail = null;
      snapshot.forEach((doc) => {
        if (doc.val().employeeId === employeeId) {
          bangCapDetail = doc.val();
        }
      });
      return bangCapDetail || {};
    } else {
      console.log("No document found with the provided bangcap_id and employeeId");
      return {};
    }
  } catch (error) {
    console.error("Error reading qualification by bangcap_id and employeeId:", error);
    return {};
  }
}

// Fetch all qualifications of employees
export async function readBangCapNhanVien() {
  try {
    const bangCapCollection = ref(database, "bangcapnhanvien");
    const snapshot = await get(bangCapCollection);

    if (snapshot.exists()) {
      const bangcapnhanvien = {};
      snapshot.forEach((doc) => {
        bangcapnhanvien[doc.key] = doc.val();
      });
      return bangcapnhanvien;
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error reading employees:", error);
  }
}

// Toggle qualification verification status
export async function toggleXacthuc(employeeId, bangcapId) {
  try {
    const docRef = ref(database, `bangcapnhanvien/${employeeId}-${bangcapId}`);
    const snapshot = await get(docRef);

    if (snapshot.exists()) {
      const currentXacthuc = snapshot.val().xacthuc;
      const newXacthuc = currentXacthuc === "0" ? "1" : "0";
      await update(docRef, { xacthuc: newXacthuc });

      console.log(`Cập nhật xacthuc thành công cho ${employeeId} - ${bangcapId}:`, newXacthuc);
      return newXacthuc;
    } else {
      console.log("Không tìm thấy tài liệu để cập nhật!");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật xacthuc:", error);
    return null;
  }
}
