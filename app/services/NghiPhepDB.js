import { database } from '../config/firebaseconfig';
import { ref, push, set, get, update } from 'firebase/database';
import { store } from "../redux/store"; // Import Redux store to access idCty

// Hàm để đăng ký nghỉ phép
export async function dangKyNghiPhep(nghiPhepData) {
  try {
    // Lấy idCty từ store
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    // Tạo một reference đến nhánh "nghiPhep" trong database của công ty
    const nghiPhepRef = ref(database, `${idCty}/nghiPhep`);

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
    // Lấy idCty từ store
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    // Tạo reference đến nhánh "nghiPhep" trong database của công ty
    const nghiPhepRef = ref(database, `${idCty}/nghiPhep`);

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

// Hàm để duyệt hoặc hủy yêu cầu nghỉ phép
export async function duyetNghiPhep(id, status, rejectReason = null) {
  try {
    // Lấy idCty từ store
    const state = store.getState();
    const idCty = state.congTy.idCty;
    
    // Tạo reference đến yêu cầu nghỉ phép cụ thể trong database của công ty
    const nghiPhepRef = ref(database, `${idCty}/nghiPhep/${id}`);

    // Tạo object cập nhật trạng thái
    const updateData = { trangThai: status };

    // Nếu có rejectReason, thêm lý do từ chối vào object cập nhật
    
      updateData.lyDoTuChoi = rejectReason;
   

    // Cập nhật trạng thái và lý do từ chối (nếu có)
    await update(nghiPhepRef, updateData);

    return { success: true, message: 'Cập nhật trạng thái thành công!' };
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái nghỉ phép:', error);
    return { success: false, message: 'Cập nhật trạng thái thất bại.', error };
  }
}

