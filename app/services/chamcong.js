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
 const fetchExistingTimeIn = async (employeeId) => {
      try {
        const date = new Date(selectedMonth);
        const year = date.getFullYear();
        const monthName = date.getMonth() + 1;
        const day = date.getDate();
        
        const database = getDatabase();
        const chamCongRef = ref(database, `chitietchamcong/${employeeId}/${year}/${monthName}/${day}`);
        const snapshot = await get(chamCongRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.timeIn) {
            // Convert timeIn string back to Date object
            const [time, period] = data.timeIn.split(' ');
            const [hours, minutes] = time.split(':');
            const timeInDate = new Date(selectedMonth);
            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            timeInDate.setHours(hour, parseInt(minutes));
            setTimeIn(timeInDate);
          }
        }
      } catch (error) {
        console.error("Error fetching existing timeIn:", error);
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
    
    // Kiểm tra dữ liệu
    if (!employeeId || !month || !status) {
      console.error('Dữ liệu không hợp lệ:', attendanceData);
      return;
    }

    const thongTinChamCongRef = ref(database, 'thongtinchamcong');

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
    const chamCongRef = ref(database, `chitietchamcong/${employeeId}/${year}/${monthName}/${day}`);
    
    // Lấy dữ liệu hiện tại nếu có
    const existingRecord = await get(chamCongRef);
    const existingData = existingRecord.exists() ? existingRecord.val() : {};

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
export async function readThongTinChamCong() {
  try {
    const db = getDatabase();
    const chamCongRef = ref(db, "thongtinchamcong");

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
    const chamCongRef = ref(db, "thongtinchamcong");

    // Thực hiện cập nhật
    await update(chamCongRef, updateData);

    console.log("Cập nhật thongtinchamcong thành công:", updateData);
  } catch (error) {
    console.error("Lỗi khi cập nhật thongtinchamcong:", error);
  }
}
