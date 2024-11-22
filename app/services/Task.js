import {
  getDatabase,
  ref,
  set,
  push
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import { getStorage } from "firebase/storage";
import { store } from "../redux/store"; // Import Redux store to access idCty

const database = getDatabase(app);
const storage = getStorage(app); // Khởi tạo Firebase Storage

// Lấy idCty từ Redux store
const getIdCty = () => {
  const state = store.getState();
  return state.congTy.idCty; // Lấy idCty từ state.congTy
};

// Tạo thông báo mới cho nhiệm vụ
export async function taoTaskDataBase(nhiemvu) {
  const idCty = getIdCty(); // Lấy idCty từ Redux
  try {
    const notificationRef = ref(database, `${idCty}/nhiemvu`); // Đặt idCty vào đường dẫn

    // Tạo thông báo mới
    const newNotificationRef = push(notificationRef);

    // Dữ liệu thông báo
    const notificationData = {
      manhiemvu: newNotificationRef.key,
      ...nhiemvu, // Giữ nguyên các dữ liệu khác từ nhiệm vụ
    };

    // Lưu thông báo vào Realtime Database
    await set(newNotificationRef, notificationData);

    console.log("Thông báo đã được tạo thành công:", notificationData);
    return notificationData;
  } catch (error) {
    console.error("Lỗi khi tạo thông báo:", error);
    throw error;
  }
}


// Thêm thông báo cho nhân viên
export async function themTaskPhanCong(employeeId, manhiemvu) {
  const idCty = getIdCty(); // Lấy idCty từ Redux
  try {
    // Dữ liệu thông báo cho nhân viên
    const notificationNhanVienData = {
      manhiemvu,
      employeeId,
      trangthai: false, // Trạng thái mặc định của nhiệm vụ là chưa hoàn thành
    };

    // Tạo key bằng employeeId-maThongBao
    const newNotificationKey = `${employeeId}-${manhiemvu}`;

    // Lưu thông báo cho nhân viên vào Realtime Database với key đã chỉ định
    await set(
      ref(database, `${idCty}/nhiemvuphancong/${newNotificationKey}`), // Thêm idCty vào tham chiếu
      notificationNhanVienData
    );

    console.log("Thông báo cho nhân viên đã được tạo thành công:", notificationNhanVienData);
    return notificationNhanVienData;
  } catch (error) {
    console.error("Lỗi khi thêm thông báo cho nhân viên:", error);
    throw error;
  }
}
