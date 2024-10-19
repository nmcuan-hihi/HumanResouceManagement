import { getDatabase, ref,set, get, child } from "firebase/database";
import { app } from "../config/firebaseconfig";
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage
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
export async function addEmployee(employeeData, profileImage) {
  try {
    employeeData.matKhau = employeeData.employeeId
    // Tạo tham chiếu tới nơi lưu trữ hình ảnh
    const imageRef = storageRef(storage, `employee/${employeeData.employeeId}.jpg`);

    // Tải lên hình ảnh
    const response = await fetch(profileImage);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);

    // Lấy URL hình ảnh
    const imageUrl = await getDownloadURL(imageRef);

    // Cập nhật imageUrl vào employeeData
    const employee = { ...employeeData, imageUrl };

    // Ghi dữ liệu nhân viên vào Realtime Database
    await set(ref(database, `employees/${employeeData.employeeId}`), employee);
    console.log(`Employee ${employeeData.employeeId} added successfully!`);
  } catch (error) {
    console.error("Error adding employee:", error);
  }
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

export function writePhongBan(phongBan) {
  const maPhongBan = phongBan.maPhongBan; 

  set(ref(database, `phongban/${maPhongBan}`), phongBan)
    .then(() => {
      console.log(`Phòng ban ${maPhongBan} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing phòng ban ${maPhongBan}:`, error);
    });
}

export async function readPhongBan() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'phongban')); 

    if (snapshot.exists()) {
      const phongBans = snapshot.val(); // Lấy dữ liệu và chuyển đổi thành đối tượng
      console.log("Phong ban data:", phongBans);
      return phongBans; // Trả về danh sách phòng ban
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading phong ban:", error);
  }
}

// bằng cấp
// Hàm ghi dữ liệu bằng cấp
export function writeBangCap(bangCap) {
  const bangCapId = bangCap.bangcap_id; // Lấy ID bằng cấp

  set(ref(database, `bangcap/${bangCapId}`), bangCap) // Lưu vào node 'bangcap'
    .then(() => {
      console.log(`Bằng cấp ${bangCapId} written successfully!`);
    })
    .catch((error) => {
      console.error(`Error writing bằng cấp ${bangCapId}:`, error);
    });
}

// Hàm đọc danh sách bằng cấp
export async function readBangCap() {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'bangcap')); // Lấy dữ liệu từ node 'bangcap'

    if (snapshot.exists()) {
      const bangCaps = snapshot.val(); // Chuyển dữ liệu thành đối tượng
      console.log("Bang cap data:", bangCaps);
      return bangCaps; // Trả về danh sách bằng cấp
    } else {
      console.log("No data available");
      return null; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Error reading bang cap:", error);
  }
}