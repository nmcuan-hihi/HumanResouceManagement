import {
  getDatabase,
  ref,
  set,
  get,
  update,
  query,
  equalTo,
  orderByChild,
  onValue,
} from "firebase/database";
import { app } from "../config/firebaseconfig"; // Assumes your Firebase configuration is here
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { store } from "../redux/store"; // Import Redux store to access idCty

const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage
function randomID(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export async function addThietBiFirebase(thietBi) {
  const random = randomID(20);
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty;

    const imageRef = storageRef(storage, `${idCty}/thietbicty/${random}.jpg`);
    const response = await fetch(thietBi.imageUrl);
    const blob = await response.blob();
    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);
    const id = random;
    const data = { ...thietBi, id, imageUrl };

    await set(ref(database, `${idCty}/thietbicty/${random}`), data);
    console.log(`them thiet bi thanh cong`);
  } catch (error) {
    console.error("Error them thiet bi", error);
  }
}

// Hàm lấy danh sách tất cả thiết bị

export function getAllThietBi(callback) {
  const state = store.getState();
  const idCty = state.congTy.idCty;

  const thietBiRef = ref(database, `${idCty}/thietbicty`);

  // Sử dụng onValue để lắng nghe thay đổi
  onValue(
    thietBiRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const thietBiList = Object.keys(data).map((key) => data[key]);
        callback(thietBiList); // Gọi callback với dữ liệu mới
      } else {
        console.log("Không có dữ liệu thiết bị.");
        callback([]); // Gọi callback với mảng rỗng
      }
    },
    (error) => {
      console.error("Lỗi khi lắng nghe thay đổi:", error);
    }
  );
}

// Hàm lấy thiết bị theo ID
export async function getThietBiById(id) {
  const state = store.getState();
  const idCty = state.congTy.idCty;
  try {
    const thietBiRef = ref(database, `${idCty}/thietbicty/${id}`);
    const snapshot = await get(thietBiRef);
    if (snapshot.exists()) {
      return snapshot.val(); // Trả về thiết bị theo ID
    } else {
      console.log(`Thiết bị với ID ${id} không tồn tại.`);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy thiết bị theo ID:", error);
  }
}

// Hàm xóa thiết bị theo ID
export async function deleteThietBi(id) {
  const state = store.getState();
  const idCty = state.congTy.idCty;
  try {
    await set(ref(database, `${idCty}/thietbicty/${id}`), null); // Xóa thiết bị
    console.log(`Xóa thiết bị với ID ${id} thành công.`);
  } catch (error) {
    console.error("Lỗi khi xóa thiết bị:", error);
  }
}

// Hàm sửa thông tin thiết bị
export async function updateThietBi(id, updatedData) {
  const state = store.getState();
  const idCty = state.congTy.idCty;
  try {
    const thietBiRef = ref(database, `${idCty}/thietbicty/${id}`);

    // Kiểm tra xem có ảnh mới không
    if (updatedData.imageUrl) {
      const imageRef = storageRef(storage, `${idCty}/thietbicty/${id}.jpg`);
      const response = await fetch(updatedData.imageUrl);
      const blob = await response.blob();

      // Tải ảnh mới lên Storage
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      // Cập nhật URL ảnh vào updatedData
      updatedData.imageUrl = imageUrl;
    }

    // Cập nhật thông tin thiết bị
    await update(thietBiRef, updatedData);
    console.log(`Cập nhật thiết bị với ID ${id} thành công.`);
  } catch (error) {
    console.error("Lỗi khi cập nhật thiết bị:", error);
  }
}
export function getAllThietBiByEmployeeId(employeeId) {
  return new Promise((resolve, reject) => {
    const state = store.getState();
    const idCty = state.congTy.idCty;

    const thietBiRef = ref(database, `${idCty}/thietbicty`);

    // Sử dụng onValue để lắng nghe thay đổi
    onValue(
      thietBiRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const thietBiList = Object.values(data);
          const newData = thietBiList.filter(
            (tb) => tb.employeeId === employeeId
          );
          resolve(newData); // Trả về dữ liệu mới
        } else {
          console.log("Không có dữ liệu thiết bị.");
          resolve([]); // Trả về mảng rỗng
        }
      },
      (error) => {
        console.error("Lỗi khi lắng nghe thay đổi:", error);
        reject(error); // Trả về lỗi
      }
    );
  });
}

// Hàm trả thiết bị
export async function traThietBi(id, updatedData) {
  const state = store.getState();
  const idCty = state.congTy.idCty;
  try {
    const thietBiRef = ref(database, `${idCty}/thietbicty/${id}`);
    await update(thietBiRef, updatedData);

    // Cập nhật thông tin thiết bị
    console.log(`Trả thiết bị với ID ${id} thành công.`);
  } catch (error) {
    console.error("Lỗi khi Trả thiết bị:", error);
  }
}

//hàm thêm thietbinhanvien
export async function addThietBiNhanVien(employeeId, thietbiId, data) {
  const state = store.getState();
  const idCty = state.congTy.idCty;

  try {
    const refPath = ref(
      database,
      `${idCty}/thietbinhanvien/${employeeId}/${thietbiId}`
    );

    // Kiểm tra thiết bị đã tồn tại chưa
    const snapshot = await get(refPath);

    if (snapshot.exists()) {
      // Nếu đã tồn tại, lấy giá trị hiện tại và tăng số lượng
      const currentData = snapshot.val();
      const updatedSoLuong = (currentData.soLuong || 0) + data.soLuong;

      await set(refPath, {
        ...currentData,
        soLuong: updatedSoLuong, // Cập nhật số lượng
      });
    } else {
      // Nếu chưa tồn tại, thêm mới với số lượng = 1
      await set(refPath, {
        ...data,
        soLuong: data.soLuong, // Đặt số lượng ban đầu là 1
      });
    }
  } catch (error) {
    console.error("Lỗi khi thêm hoặc cập nhật thiết bị:", error);
  }
}

// lấy ds thiết bị nv

export async function getThietBiNhanVien(employeeId) {
  const state = store.getState();
  const idCty = state.congTy.idCty;

  try {
    // Lấy dữ liệu từ Firebase
    const snapshot = await get(
      ref(database, `${idCty}/thietbinhanvien/${employeeId}`)
    );
    if (snapshot.exists()) {
      const data = snapshot.val();
      const thietBiList = Object.values(data);
      return thietBiList;
    } else {
      console.log("Không tìm thấy thiết bị cho nhân viên này.");
      return []; // Không có dữ liệu
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thiết bị:", error);
    return [];
  }
}

// Hàm cập nhật thiết bị nhân viên
export async function updateThietBiNhanVien(
  employeeId,
  thietbiId,
  updatedData
) {
  const state = store.getState();
  const idCty = state.congTy.idCty;

  try {
    const refPath = ref(
      database,
      `${idCty}/thietbinhanvien/${employeeId}/${thietbiId}`
    );

    // Kiểm tra thiết bị đã tồn tại chưa
    const snapshot = await get(refPath);

    if (snapshot.exists()) {
      // Nếu đã tồn tại, lấy giá trị hiện tại
      const currentData = snapshot.val();

      // Cập nhật dữ liệu thiết bị
      const updatedDevice = {
        ...currentData,
        ...updatedData,
      };

      await set(refPath, updatedDevice);
    } else {
      console.warn("Thiết bị không tồn tại để cập nhật.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thiết bị:", error);
  }
}
