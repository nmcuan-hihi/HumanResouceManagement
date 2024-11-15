// app/services/NghiPhepDB.js
import { database } from "../config/firebaseconfig";
import { ref, push, set, get, update,onValue } from "firebase/database";

export async function taoThongBaoDataBase(thongBao) {
  try {
    const notificationRef = ref(database, `thongbaocty`);

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
      ref(database, `thongbaonhanvien/${newNotificationKey}`),
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

export async function layDanhSachThongBaoNhanVien(employeeId) {
  try {
    const thongBaoRef = ref(database, `thongbaonhanvien`);

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




// Hàm này để lắng nghe thông báo cho nhân viên
export function listenForNotifications(employeeId, callback) {
    const thongBaonhanVienRef = ref(database, `thongbaonhanvien`);
  
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




export async function layThongBaoById(maThongBao) {
  try {
    // Tạo tham chiếu đến thông báo theo key
    const notificationRef = ref(database, `thongbaocty/${maThongBao}`);

    // Lấy dữ liệu từ Realtime Database
    const snapshot = await get(notificationRef);

    // Kiểm tra nếu snapshot tồn tại và có dữ liệu
    if (!snapshot.exists()) {
      console.log(`Không tìm thấy thông báo với key: ${maThongBao}`);
      return null;
    }

    // Trả về thông báo
    const thongBao = snapshot.val();
    return thongBao;
  } catch (error) {
    console.error("Lỗi khi lấy thông báo theo key:", error);
    throw error;
  }
}

export async function capNhatTrangThaiThongBao(employeeId, maThongBao) {
    try {
      // Tạo key bằng employeeId-maThongBao
      const notificationKey = `${employeeId}-${maThongBao}`;
  
      // Tạo tham chiếu đến thông báo theo key
      const notificationRef = ref(database, `thongbaonhanvien/${notificationKey}`);
  
      // Cập nhật trạng thái
      await update(notificationRef, { trangThai: true });
  
      console.log(`Cập nhật trạng thái cho thông báo nhân viên ${maThongBao} thành công.`);
      return true;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thông báo:", error);
      throw error;
    }
  }

