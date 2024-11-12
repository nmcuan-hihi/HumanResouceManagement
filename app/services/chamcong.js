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

    // Định dạng `month` thành ngày/tháng/năm
    const formattedMonth = new Date(month).toLocaleDateString('vi-VN');

    const maLuongThang = new Date(timeIn).getMonth() + 1;
    const yea = new Date(month).getFullYear();
    const day = new Date(month).getDate();

    const maChamCong = await getNextChamCongCode();
    if (!maChamCong) {
      console.error('Không thể tạo mã chấm công');
      return;
    }

    const gioVao = new Date(timeIn).getHours();
    const gioRa = new Date(timeOut).getHours();
    const diMuon = gioVao >= 9 && gioVao < 11;
    const vangMat = gioVao >= 11;
    const tangCa = gioRa >17;

    await setDoc(doc(firestore, "chitietchamcong", `${employeeId}-${day}-${maLuongThang}-${yea}`), {
      employeeId,
      timeIn: formattedTimeIn,
      timeOut: formattedTimeOut,
      status,
      month: formattedMonth,
      maLuongThang,
      maChamCong,
      diMuon,
      vangMat,
      tangCa,
      createdAt: serverTimestamp(),
    });

    console.log('Chấm công thành công');
  } catch (error) {
    console.error('Lỗi khi lưu chấm công:', error);
  }
};
