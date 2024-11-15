import { getDatabase, ref, get, set, update, serverTimestamp } from 'firebase/database';
import { app } from '../config/firebaseconfig';  // Đảm bảo cấu hình đúng

export const getEmployeesWithLeave = async (today) => {
  try {
    const db = getDatabase(app);
    const employeesRef = ref(db, 'employees');  // Đường dẫn tới bảng nhân viên
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
        leave.trangThai !== "-1"
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
    const db = getDatabase(app);
    const employeesRef = ref(db, "employees");
    const leaveRef = ref(db, "nghiPhep");

    // Đọc danh sách nhân viên
    const snapshotEmployees = await get(employeesRef);
    if (!snapshotEmployees.exists()) {
      return [];
    }
    const employees = snapshotEmployees.val();

    // Đọc danh sách nghỉ phép
    const snapshotLeave = await get(leaveRef);
    if (!snapshotLeave.exists()) {
      return Object.values(employees).filter(
        (employee) => employee.phongbanId === phongbanId && employee.trangthai === "true"
      );
    }
    const leaves = snapshotLeave.val();

    // Lọc danh sách nhân viên theo phòng ban và nghỉ phép
    const filteredEmployees = Object.values(employees).filter((employee) => {
      const isOnLeave = Object.values(leaves).some(
        (leave) =>
          leave.employeeId === employee.employeeId &&
          leave.ngayBatDau <= today &&
          leave.ngayKetThuc >= today &&
          leave.trangThai !== "-1"
      );

      return (
        employee.phongbanId === phongbanId &&
        !isOnLeave &&
        employee.trangthai === "true"
      );
    });

    return filteredEmployees;
  } catch (error) {
    console.error("Lỗi khi lọc nhân viên theo phòng ban và nghỉ phép:", error);
    return [];
  }
}


export const getEmployeesWithLeave2 = async () => {
  const db = getDatabase();
  
  // Lấy danh sách nhân viên từ Firebase Realtime Database
  const employeesRef = ref(db, 'employees');
  const leavesRef = ref(db, 'nghiPhep');
  
  try {
    // Lấy tất cả dữ liệu nhân viên
    const employeeSnapshot = await get(employeesRef);
    const employees = employeeSnapshot.val();
    
    // Lấy tất cả dữ liệu nghỉ phép
    const leaveSnapshot = await get(leavesRef);
    const leaves = leaveSnapshot.val();

    // Lấy ngày hiện tại
    const currentDate = new Date().toLocaleDateString('vi-VN');  // dd/MM/yyyy

    
    // Lọc danh sách nhân viên để loại bỏ những người đang nghỉ trong ngày hiện tại
    const filteredEmployees = Object.keys(employees).filter(employeeId => {
      const employee = employees[employeeId];
      const leave = Object.values(leaves).find(leave => leave.employeeId === employeeId);
      
      // Kiểm tra xem nhân viên có ngày nghỉ trùng với ngày hiện tại không
      if (leave) {
        const leaveStartDate = leave.ngayBatDau;
        const leaveEndDate = leave.ngayKetThuc;

        // Nếu nhân viên đang nghỉ phép trong ngày hôm nay thì không thêm vào danh sách
        if (currentDate >= leaveStartDate && currentDate <= leaveEndDate) {
          return false;
        }
      }

      // Nếu không có nghỉ phép hoặc không nghỉ trong ngày hiện tại, nhân viên sẽ có mặt trong danh sách
      return true;
    });

    // Lấy thông tin của các nhân viên còn lại
    const activeEmployees = filteredEmployees.map(employeeId => employees[employeeId]);

    console.log(activeEmployees);
    return activeEmployees;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};
// Lấy instance của Realtime Database
const database = getDatabase(app);

// Hàm tạo mã tự động tăng cho maChamCong
const getNextChamCongCode = async () => {
  try {
    const counterRef = ref(database, 'counter/chamCongCounter'); // Sử dụng 1 document làm bộ đếm cho mã chấm công
    const counterSnap = await get(counterRef);

    if (!counterSnap.exists()) {
      // Nếu không có document counter, tạo mới và khởi tạo giá trị đếm
      await set(counterRef, { maChamCong: 1 });
      return 'MCC0001';  // Mã chấm công đầu tiên
    } else {
      // Lấy giá trị đếm hiện tại và tăng lên
      const currentValue = counterSnap.val().maChamCong;
      const nextValue = currentValue + 1;

      // Tạo mã chấm công mới
      const newChamCongCode = `MCC${String(nextValue).padStart(4, '0')}`; // Đảm bảo mã có 4 chữ số

      // Cập nhật lại bộ đếm
      await update(counterRef, { maChamCong: nextValue });

      return newChamCongCode;
    }
  } catch (error) {
    console.error('Lỗi khi lấy mã chấm công tự động:', error);
    return null; // Nếu có lỗi, trả về null
  }
};

export const addChiTietChamCongToRealtime = async (attendanceData) => {
  try {
    const { employeeId, timeIn, timeOut, status, month } = attendanceData;

    if (!employeeId || !timeIn || !timeOut || !status || !month) {
      console.error('Dữ liệu không hợp lệ:', attendanceData);
      return;
    }

    // Định dạng `timeIn` và `timeOut` với giờ, phút và buổi
    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Định dạng 12 giờ
      return `${formattedHours}:${minutes} ${period}`;
    };

    const formattedTimeIn = formatTime(new Date(timeIn));
    const formattedTimeOut = formatTime(new Date(timeOut));

    // Lấy thông tin ngày, tháng, năm
    const date = new Date(month);
    const year = date.getFullYear();
    const monthName = `${date.getMonth() + 1}`;
    const day = date.getDate();

    // Xử lý các trạng thái
    const gioVao = new Date(timeIn).getHours();
    const gioRa = new Date(timeOut).getHours();
    const diMuon = gioVao > 9 && gioVao < 11;
    const vangMat = gioVao >= 11;

    // Tính số giờ tăng ca nếu `timeOut` sau 17:00
    let tangCaHours = 0;
    if (gioRa > 17) {
      const overtimeStart = new Date(timeOut);
      overtimeStart.setHours(17, 0, 0, 0); // Bắt đầu tính tăng ca từ 5 PM
      tangCaHours = (new Date(timeOut) - overtimeStart) / (1000 * 60 * 60); // Số giờ tăng ca
    }

    // Tạo đường dẫn
    const chamCongRef = ref(database, `chitietchamcong/${employeeId}/${year}/${monthName}/${day}`);

    // Lưu dữ liệu vào Realtime Database
    await set(chamCongRef, {
      employeeId,
      timeIn: formattedTimeIn,
      timeOut: formattedTimeOut,
      status,
      diMuon,
      vangMat,
      tangCa: tangCaHours,
      loaiChamCong: '0',
      createdAt: serverTimestamp(),
    });

    console.log('Chấm công thành công');
  } catch (error) {
    console.error('Lỗi khi lưu chấm công:', error);
  }
};

export const getEmployeesByLeaveType = async (leaveType = "Có lương") => {
  try {
    const db = getDatabase(app);
    const employeesRef = ref(db, 'employees');  // Đường dẫn tới bảng nhân viên
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

