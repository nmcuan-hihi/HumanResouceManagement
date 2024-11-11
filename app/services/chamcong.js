import { getFirestore, doc, setDoc, Timestamp, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { app } from '../config/firebaseconfig';  // Đảm bảo cấu hình đúng

// Lấy Firestore instance
const firestore = getFirestore(app);

// Hàm tạo mã tự động tăng cho maChamCong
const getNextChamCongCode = async () => {
  try {
    const counterDoc = doc(firestore, 'counter', 'chamCongCounter'); // Sử dụng 1 document làm bộ đếm cho mã chấm công
    const counterSnap = await getDoc(counterDoc);

    if (!counterSnap.exists()) {
      // Nếu không có document counter, tạo mới và khởi tạo giá trị đếm
      await setDoc(counterDoc, { maChamCong: 1 });
      return 'MCC0001';  // Mã chấm công đầu tiên
    } else {
      // Lấy giá trị đếm hiện tại và tăng lên
      const currentValue = counterSnap.data().maChamCong;
      const nextValue = currentValue + 1;

      // Tạo mã chấm công mới
      const newChamCongCode = `MCC${String(nextValue).padStart(4, '0')}`; // Đảm bảo mã có 4 chữ số

      // Cập nhật lại bộ đếm
      await updateDoc(counterDoc, { maChamCong: nextValue });

      return newChamCongCode;
    }
  } catch (error) {
    console.error('Lỗi khi lấy mã chấm công tự động:', error);
    return null; // Nếu có lỗi, trả về null
  }
};

export const addChiTietChamCongToFireStore = async (attendanceData) => {
  try {
    const { employeeId, timeIn, timeOut, status, month } = attendanceData;

    // Kiểm tra xem các trường có bị undefined không
    if (!employeeId || !timeIn || !timeOut || !status || !month) {
      console.error('Dữ liệu không hợp lệ:', attendanceData);
      return; // Dừng lại nếu có trường bị thiếu
    }

    // Lấy mã lương tháng từ tháng của thời gian chấm công
    const maLuongThang = new Date(timeIn).getMonth() + 1;  // Lấy tháng từ timeIn (0-indexed)
    console.log('timein', month);
    console.log('Mã lương tháng:', maLuongThang);
    const yea = new Date(month).getFullYear();
    console.log('Năm', yea);
    const day = new Date(month).getDate();
    console.log('ngay', day);
    // Lấy mã chấm công tự động tăng
    const maChamCong = await getNextChamCongCode();
    if (!maChamCong) {
      console.error('Không thể tạo mã chấm công');
      return; // Dừng lại nếu không tạo được mã chấm công
    }
    console.log('Mã chấm công:', maChamCong);

    // Thêm chi tiết chấm công vào Firestore
    await setDoc(doc(firestore, "chitietchamcong", employeeId+"-"+day+"-"+maLuongThang+"-"+yea), {
      employeeId: employeeId,
      timeIn: Timestamp.fromDate(new Date(timeIn)),  // Chuyển đổi thời gian vào thành Timestamp
      timeOut: Timestamp.fromDate(new Date(timeOut)),
      status,
      month,
      maLuongThang: maLuongThang,  // Mã lương tháng lấy từ tháng của timeIn
      maChamCong: maChamCong,
      createdAt: serverTimestamp(),  // Thêm thời gian tạo
    });

    console.log('Chấm công thành công');
  } catch (error) {
    console.error('Lỗi khi lưu chấm công:', error);
  }
};
