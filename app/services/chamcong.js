import { getDatabase, ref, get, set, update, serverTimestamp } from 'firebase/database';
import { app } from '../config/firebaseconfig';  // Đảm bảo cấu hình đúng
import { store, storeHRM } from "../redux/store";
const database = getDatabase(app);
const storage = getStorage(app); // Initialize Firebase Storage

export const getEmployeesWithLeave = async (today) => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store
    const db = getDatabase(app);
    const employeesRef = ref(db, `${idCty}/employees`);  // Đường dẫn tới bảng nhân viên
    const leaveRef = ref(db, 'nghiPhep');      // Đường dẫn tới bảng nghỉ phép
    const snapshotEmployees = await get(employeesRef);
    const snapshotLeave = await get(leaveRef);
    
    if (!snapshotEmployees.exists() || !snapshotLeave.exists()) {
      console.log("Không có dữ liệu nhân viên hoặc nghỉ phép");
      return [];
    }

    // Lấy danh sách nhân viên từ Firebase
    const employees = snapshotEmployees.val();
    
    // Lấy danh sách nghỉ phép từ Firebase
    const leaves = snapshotLeave.val();
    
    // Lọc danh sách nhân viên
    const filteredEmployees = Object.values(employees).filter(employee => {
      // Kiểm tra nếu nhân viên có trạng thái "false" hoặc đang nghỉ phép trong ngày `today`
      const isOnLeave = Object.values(leaves).some(leave => 
        leave.employeeId === employee.employeeId &&
        leave.ngayBatDau <= today &&
        leave.ngayKetThuc >= today &&
        leave.trangThai === "1"
      );

      // Trả về true nếu nhân viên không nghỉ phép và có trang thái là true (đi làm)
      return !isOnLeave && employee.trangthai === "true";
    });

    return filteredEmployees;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên: ", error);
    return [];
  }
};

export async function getFilteredEmployeesByPhongBanAndLeave(phongbanId, today) {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store
    const db = getDatabase(app);
    const employeesRef = ref(db, `${idCty}/employees`);
    const leaveRef = ref(db, `${idCty}/nghiPhep`);

    // Đọc danh sách nhân viên
    const snapshotEmployees = await get(employeesRef);
    if (!snapshotEmployees.exists()) {
      return [];
    }
    const employees = snapshotEmployees.val();

    // Đọc danh sách nghỉ phép
    const snapshotLeave = await get(leaveRef);
    if (!snapshotLeave.exists()) {
      // Không có dữ liệu nghỉ phép, trả về danh sách nhân viên trong phòng ban
      return Object.values(employees).filter(
        (employee) => employee.phongbanId === phongbanId && employee.trangthai === "true"
      );
    }
    const leaves = snapshotLeave.val();

    // Lọc danh sách nhân viên
    const filteredEmployees = Object.values(employees).filter((employee) => {
      // Kiểm tra nhân viên có lịch nghỉ "Không lương" trong ngày hôm nay
      const isOnUnpaidLeave = Object.values(leaves).some(
        (leave) =>
          leave.employeeId === employee.employeeId &&
          leave.ngayBatDau <= today &&
          leave.ngayKetThuc >= today &&
          leave.loaiNghi === "Không lương"&& 
          leave.trangThai === "1"
      );
      
      // Nhân viên chỉ được hiển thị nếu thuộc phòng ban và không có lịch nghỉ "Không lương"
      return (
        employee.phongbanId === phongbanId &&
        !isOnUnpaidLeave &&
        employee.trangthai === "true"
      );
    });

    // Cập nhật trạng thái checkbox cho những nhân viên có "Có lương"
    const updatedEmployees = filteredEmployees.map((employee) => ({
      ...employee,
      trangthaiCheckbox: Object.values(leaves).some(
        (leave) =>
          leave.employeeId === employee.employeeId &&
        leave.ngayBatDau <= today &&
          leave.ngayKetThuc >= today &&
          leave.trangThai === "1" &&
          leave.loaiNghi === "Có lương" // Đánh dấu checkbox nếu có lương
      ),
    }));

    return updatedEmployees;
  } catch (error) {
    console.error("Lỗi khi lọc nhân viên theo phòng ban và nghỉ phép:", error);
    return [];
  }
}



export const addChiTietChamCongToRealtime = async (attendanceData) => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store
    const { employeeId, timeIn, timeOut, status, month } = attendanceData;

    // Kiểm tra dữ liệu
    if (!employeeId || !month || !status) {
      console.error('Dữ liệu không hợp lệ:', attendanceData);
      return;
    }

    const thongTinChamCongRef = ref(database, `${idCty}/thongtinchamcong`);

    // Lấy dữ liệu hiện tại từ Realtime Database
    const snapshot = await get(thongTinChamCongRef);
    if (!snapshot.exists()) {
      console.error('Không tìm thấy dữ liệu thongtinchamcong');
      return;
    }

    const thongTinChamCong = snapshot.val();
    const { giovaolam, giotanlam, handitre } = thongTinChamCong;

    if (!giovaolam || !giotanlam || !handitre) {
      console.error('Dữ liệu thongtinchamcong không đầy đủ:', thongTinChamCong);
      return;
    }

    // Hàm định dạng giờ
    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes} ${period}`;
    };

    // Lấy thông tin ngày tháng
    const date = new Date(month);
    const year = date.getFullYear();
    const monthName = `${date.getMonth() + 1}`;
    const day = date.getDate();

    // Tham chiếu tới bản ghi chấm công của nhân viên
    const chamCongRef = ref(database, `${idCty}/chitietchamcong/${employeeId}/${year}/${monthName}/${day}`);

    // Lấy dữ liệu hiện tại nếu có
    const existingRecord = await get(chamCongRef);
    const existingData = existingRecord.exists() ? existingRecord.val() : {};

    // Kiểm tra nếu là timeOut nhưng chưa có timeIn
    if (timeOut && !timeIn && !existingData.timeIn) {
      throw new Error(`Nhân viên ${employeeId} chưa chấm công giờ vào`);
    }

    let updatedData = {
      ...existingData,
      employeeId,
      status,
      loaiChamCong: '0',
    };

    // Xử lý timeIn
    if (timeIn) {
      const formattedTimeIn = formatTime(new Date(timeIn));
      const gioVao = new Date(timeIn).getHours();
      updatedData = {
        ...updatedData,
        timeIn: formattedTimeIn,
        diMuon: gioVao > parseInt(giovaolam) && gioVao < parseInt(handitre),
        vangMat: gioVao >= parseInt(handitre),
      };
    }

    // Xử lý timeOut
    if (timeOut) {
      const formattedTimeOut = formatTime(new Date(timeOut));
      const gioRa = new Date(timeOut).getHours();
      let tangCaHours = 0;

      if (gioRa > parseInt(giotanlam)) {
        const overtimeStart = new Date(timeOut);
        overtimeStart.setHours(parseInt(giotanlam), 0, 0, 0);
        tangCaHours = (new Date(timeOut) - overtimeStart) / (1000 * 60 * 60);
      }

      updatedData = {
        ...updatedData,
        timeOut: formattedTimeOut,
        tangCa: tangCaHours,
      };
    }

    // Lưu dữ liệu vào Realtime Database
    await set(chamCongRef, {
      ...updatedData,
      createdAt: serverTimestamp(),
    });

    console.log('Chấm công thành công');
  } catch (error) {
    console.log('Lỗi khi lưu chấm công:', error);
    throw error; // Ném lỗi để component có thể xử lý
  }
};

export const getEmployeesByLeaveType = async (leaveType = "Có lương") => {
  try {
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store
    const db = getDatabase(app);
    const employeesRef = ref(db, `${idCty}/employees`);  // Đường dẫn tới bảng nhân viên
    const leaveRef = ref(db, `${idCty}/nghiPhep`);      // Đường dẫn tới bảng nghỉ phép
    const snapshotEmployees = await get(employeesRef);
    const snapshotLeave = await get(leaveRef);
    
    if (!snapshotEmployees.exists() || !snapshotLeave.exists()) {
      console.log("Không có dữ liệu nhân viên hoặc nghỉ phép");
      return [];
    }

    // Lấy danh sách nhân viên từ Firebase
    const employees = snapshotEmployees.val();
    
    // Lấy danh sách nghỉ phép từ Firebase
    const leaves = snapshotLeave.val();
    
    // Kiểm tra xem leaves có phải là đối tượng hay không
    if (typeof leaves !== 'object') {
      console.log("Dữ liệu nghỉ phép không phải là đối tượng hợp lệ:", leaves);
      return [];
    }

    // Chuyển đổi đối tượng nghỉ phép thành mảng
    const leavesArray = Object.values(leaves);

    // Lọc danh sách nhân viên
    const filteredEmployees = Object.values(employees).map(employee => {
      // Kiểm tra nếu nhân viên có trạng thái nghỉ phép trong ngày hôm nay
      const today = new Date().toLocaleDateString('vi-VN');  // dd/MM/yyyy
      const isOnLeave = leavesArray.some(leave => 
        leave.employeeId === employee.employeeId &&
        leave.ngayBatDau <= today &&
        leave.ngayKetThuc >= today 
      );

      // Lọc theo loại nghỉ
      const isLeaveTypeMatch = leaveType === "Có lương" 
        ? leavesArray.some(leave => leave.employeeId === employee.employeeId && leave.loaiNghi === "Có lương")
        : leaveType === "Không lương" 
        ? leavesArray.some(leave => leave.employeeId === employee.employeeId && leave.loaiNghi === "Không lương")
        : true; // Trường hợp mặc định lấy tất cả

      // Trả về đối tượng nhân viên, có thể thêm thuộc tính `isOnLeave` nếu cần
      return isLeaveTypeMatch ? {
        ...employee,
        isOnLeave
      } : null;
    }).filter(employee => employee !== null); // Loại bỏ những nhân viên không thỏa mãn điều kiện

    return filteredEmployees;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhân viên: ", error);
    return [];
  }
};
export async function readThongTinChamCong() {
  try {
    const db = getDatabase();
    const state = store.getState();
    const idCty = state.congTy.idCty; // Lấy idCty từ Redux store
    const chamCongRef = ref(db, `${idCty}/thongtinchamcong`);

    const snapshot = await get(chamCongRef);
    if (snapshot.exists()) {
      console.log("Dữ liệu thongtinchamcong:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("Không có dữ liệu trong thongtinchamcong.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi đọc thongtinchamcong:", error);
    return null;
  }
}
export async function updateThongTinChamCong(updateData) {
  try {
    const db = getDatabase();
    const chamCongRef = ref(db, `${idCty}/thongtinchamcong`);

    // Thực hiện cập nhật
    await update(chamCongRef, updateData);

    console.log("Cập nhật thongtinchamcong thành công:", updateData);
  } catch (error) {
    console.error("Lỗi khi cập nhật thongtinchamcong:", error);
  }
}
