// app/services/NghiPhepDB.js
import { database } from '../config/firebaseconfig';
import { ref, push, set } from 'firebase/database';

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
      ngayBatDau: nghiPhepData.startDate,
      ngayKetThuc: nghiPhepData.endDate,
      tieuDe: nghiPhepData.title,
      lyDo: nghiPhepData.reason,
      loaiNghi: nghiPhepData.type, // Có lương hoặc không lương
      trangThai: nghiPhepData.status || 'Chưa duyệt', // Trạng thái yêu cầu nghỉ phép
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
