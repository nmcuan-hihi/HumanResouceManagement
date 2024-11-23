import {
  getDatabase,
  ref,
  set,
  get ,
  onValue ,
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
export async function layTatCaNhiemVu() {
  const idCty = getIdCty(); // Get the company ID from Redux store

  try {
    const tasksRef = ref(database, `${idCty}/nhiemvu`);
    const snapshot = await get(tasksRef);

    if (snapshot.exists()) {
      return snapshot.val();  // Return all tasks
    } else {
      console.log("No tasks found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}
export async function layNhiemVuById(manhiemvu) {
  const idCty = getIdCty(); // Lấy idCty từ Redux
  try {
    // Tạo tham chiếu đến nhiệm vụ trong Firebase Realtime Database
    const notificationRef = ref(database, `${idCty}/nhiemvu/${manhiemvu}`);

    // Lấy snapshot từ Firebase
    const snapshot = await get(notificationRef);

    // Kiểm tra xem nhiệm vụ có tồn tại không
    if (!snapshot.exists()) {
      console.log(`Không tìm thấy nhiệm vụ với key: ${manhiemvu}`);
      return null; // Trả về null nếu không tìm thấy
    }

    const nhiemvu = snapshot.val(); // Lấy dữ liệu nhiệm vụ từ snapshot
    return nhiemvu; // Trả về dữ liệu nhiệm vụ
  } catch (error) {
    console.error("Lỗi khi lấy nhiệm vụ theo key:", error);
    throw error; // Ném lỗi nếu có lỗi xảy ra
  }
}

export function listenForTask(employeeId, callback) {
  const idCty = getIdCty();
  const thongBaonhanVienRef = ref(database, `${idCty}/nhiemvuphancong`); // Thêm idCty vào tham chiếu

  // Đăng ký listener trên ref này
  onValue(thongBaonhanVienRef, (snapshot) => {
    if (snapshot.exists()) {
      const danhSachThongBao = [];
      snapshot.forEach((childSnapshot) => {
        const thongBao = childSnapshot.val();
        // Kiểm tra nếu employeeId khớp
        if (thongBao.employeeId === employeeId) {
          danhSachThongBao.push(thongBao);
        }
      });
      // Gọi callback với danh sách thông báo
      callback(danhSachThongBao);
    } else {
      console.log("Không có dữ liệu nào.");
      callback([]);
    }
  });
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
