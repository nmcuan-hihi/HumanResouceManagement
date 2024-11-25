import { database } from "../config/firebaseconfig";
import { ref, push, set, get, update, onValue,off } from "firebase/database";
import { store } from "../redux/store"; // Import Redux store to access idCty

// Lấy idCty từ Redux store
const state = store.getState();
const idCty = state.congTy.idCty; // Lấy idCty từ state

// Tạo thông báo cho công ty
export async function taoThongBaoDataBase(thongBao) {
  try {
    const notificationRef = ref(database, `${idCty}/thongbaocty`); // Đặt idCty vào đường dẫn

    // Tạo thông báo mới
    const newNotificationRef = push(notificationRef);

    // Dữ liệu thông báo
    const notificationData = {
      maThongBao: newNotificationRef.key,
      thoiGian: Date.now(),
      ...thongBao,
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
export async function themThongBaoNhanVien(employeeId, maThongBao) {
  try {
    // Dữ liệu thông báo cho nhân viên
    const notificationNhanVienData = {
      maThongBao,
      employeeId,
      trangThai: false,
    };

    // Tạo key bằng employeeId-maThongBao
    const newNotificationKey = `${employeeId}-${maThongBao}`;

    // Lưu thông báo cho nhân viên vào Realtime Database với key đã chỉ định
    await set(
      ref(database, `${idCty}/thongbaonhanvien/${newNotificationKey}`), // Thêm idCty vào tham chiếu
      notificationNhanVienData
    );

    console.log(
      "Thông báo cho nhân viên đã được tạo thành công:",
      notificationNhanVienData
    );
    return notificationNhanVienData;
  } catch (error) {
    console.error("Lỗi khi thêm thông báo cho nhân viên:", error);
    throw error;
  }
}

// Lấy danh sách thông báo cho nhân viên
export async function layDanhSachThongBaoNhanVien(employeeId) {
  try {
    const thongBaoRef = ref(database, `${idCty}/thongbaonhanvien`); // Thêm idCty vào tham chiếu

    const snapshot = await get(thongBaoRef);

    if (!snapshot.exists()) {
      console.log("Không có dữ liệu nào.");
      return [];
    }

    const danhSachThongBao = [];

    snapshot.forEach((childSnapshot) => {
      const thongBao = childSnapshot.val();
      // Kiểm tra nếu maNhanVien khớp với employeeId
      if (thongBao.employeeId === employeeId) {
        danhSachThongBao.push(thongBao);
      }
    });
    return danhSachThongBao;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error);
    throw error;
  }
}

// Lắng nghe thông báo cho nhân viên

export function listenForNotifications(employeeId, callback) {
  const thongBaonhanVienRef = ref(database, `${idCty}/thongbaonhanvien`); // Thêm idCty vào tham chiếu
  
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

  // Trả về một hàm hủy đăng ký
  return () => off(thongBaonhanVienRef);
}
// Lấy thông báo theo ID
export async function layThongBaoById(maThongBao) {
  try {
    const notificationRef = ref(database, `${idCty}/thongbaocty/${maThongBao}`); // Thêm idCty vào tham chiếu

    const snapshot = await get(notificationRef);

    if (!snapshot.exists()) {
      console.log(`Không tìm thấy thông báo với key: ${maThongBao}`);
      return null;
    }

    const thongBao = snapshot.val();
    return thongBao;
  } catch (error) {
    console.error("Lỗi khi lấy thông báo theo key:", error);
    throw error;
  }
}

// Cập nhật trạng thái thông báo cho nhân viên
export async function capNhatTrangThaiThongBao(employeeId, maThongBao) {
  try {
    const notificationKey = `${employeeId}-${maThongBao}`;

    const notificationRef = ref(database, `${idCty}/thongbaonhanvien/${notificationKey}`); // Thêm idCty vào tham chiếu

    await update(notificationRef, { trangThai: true });

    console.log(`Cập nhật trạng thái cho thông báo nhân viên ${maThongBao} thành công.`);
    return true;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái thông báo:", error);
    throw error;
  }
}
