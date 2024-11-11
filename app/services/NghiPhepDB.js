// app/services/NghiPhepDB.js
import { database } from '../config/firebaseconfig';
import { ref, push, set, get } from 'firebase/database';

// Hàm để đăng ký nghỉ phép
export async function dangKyNghiPhep(nghiPhepData) {
  try {
    // Tạo một reference đến nhánh "nghiPhep" trong database
    const nghiPhepRef = ref(database, 'nghiPhep');

    // Tạo một ID mới cho yêu cầu nghỉ phép
    const newNghiPhepRef = push(nghiPhepRef);

     // Cấu trúc dữ liệu nghỉ phép từ đối tượng
     const dataToSave = {
      employeeId: nghiPhepData.employeeId,
      employeeName: nghiPhepData.employeeName, // Thêm tên nhân viên
      department: nghiPhepData.department, 
      ngayBatDau: nghiPhepData.startDate,
      ngayKetThuc: nghiPhepData.endDate,
      tieuDe: nghiPhepData.title,
      lyDo: nghiPhepData.reason,
      loaiNghi: nghiPhepData.type, 
      trangThai: nghiPhepData.status || 'Chưa duyệt',
      createdAt: new Date().toISOString(), // Ngày tạo yêu cầu
    };

    // Lưu dữ liệu vào Firebase Realtime Database
    await set(newNghiPhepRef, dataToSave);

    return { success: true, message: 'Đăng ký nghỉ phép thành công!' };
  } catch (error) {
    console.error('Lỗi khi đăng ký nghỉ phép:', error);
    return { success: false, message: 'Đăng ký nghỉ phép thất bại.', error };
  }
}

// Hàm để lấy tất cả yêu cầu nghỉ phép
export async function layDanhSachNghiPhep() {
  try {
    // Tạo reference đến nhánh "nghiPhep" trong database
    const nghiPhepRef = ref(database, 'nghiPhep');

    // Lấy dữ liệu từ Firebase
    const snapshot = await get(nghiPhepRef);

    // Kiểm tra xem có dữ liệu không
    if (snapshot.exists()) {
      const nghiPhepData = snapshot.val();
      
      // Chuyển đổi dữ liệu thành một mảng các yêu cầu nghỉ phép
      const nghiPhepList = Object.keys(nghiPhepData).map((key) => ({
        id: key,
        ...nghiPhepData[key],
      }));

      return {data: nghiPhepList };
    } else {
      return { message: 'Không có dữ liệu nghỉ phép.' };
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu nghỉ phép:', error);
    return { success: false, message: 'Lỗi khi lấy dữ liệu nghỉ phép.', error };
  }
}
