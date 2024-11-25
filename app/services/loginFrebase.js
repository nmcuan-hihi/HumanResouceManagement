import {
  getDatabase,
  ref,
  set,
  get,
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import { addEmployeeFireStore } from "./EmployeeFireBase";
import { writePhongBan ,createChucVu} from "./database";

const database = getDatabase(app); // Khởi tạo Realtime Database

// Hàm lấy ID công ty (giữ nguyên logic ref của bạn)
export const getIdCtyData = async (id) => {
  try {
    const dbRef = ref(database); // Truy cập toàn bộ cơ sở dữ liệu
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const keys = Object.keys(data);

      if (keys.includes(id)) {
        return id; // Trả về ID công ty nếu tồn tại
      } else {
        return null; // Không tìm thấy công ty
      }
    } else {
      console.warn("Không tìm thấy dữ liệu trong cơ sở dữ liệu.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu ID công ty:", error);
    throw error;
  }
};

// Hàm kiểm tra công ty đã tồn tại (giữ nguyên ref của bạn)
export const checkCompanyExists = async (idCongTy) => {
  try {
    const dbRef = ref(database, `${idCongTy}`); // Kiểm tra cụ thể theo ID công ty
    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      return true; // Công ty đã tồn tại
    } else {
      return false; // Công ty chưa tồn tại
    }
  } catch (error) {
    console.error("Lỗi khi kiểm tra công ty:", error);
    throw error;
  }
};

export const addCompany = async (idCongTy, tenCongTy, tenGiamDoc, sdt) => {
  try {
    // Tạo đường dẫn lưu thông tin công ty
    const companyRef = ref(database, `${idCongTy}/data`);
    const companyData = {
      tenCongTy,
      tenGiamDoc,
      sdt,
    };

    // Thêm thông tin công ty
    await set(companyRef, companyData);

    // Thêm giám đốc mặc định
    await addDefaultDirector();

    // Thêm phòng ban Nhân Sự
    await addDefaultPhongBan();

    // Thêm các chức vụ mặc định
    await addDefaultChucVu();

    console.log("Thêm công ty, phòng ban, và chức vụ thành công!");
    return true; // Thêm thành công
  } catch (error) {
    console.error("Lỗi khi thêm công ty:", error);
    return false; // Thêm thất bại
  }
};

// Thêm giám đốc mặc định
const addDefaultDirector = async () => {
  const emp = {
    cccd: "",
    employeeId: "NV000",
    name: "",
    diachi: "",
    sdt: "",
    gioitinh: "Nam",
    phongbanId: "",
    chucvuId: "GD",
    luongcoban: "",
    ngaysinh: "",
    ngaybatdau: "",
    matKhau: "NV000",
    trangthai: "true",
  };
  await addEmployeeFireStore(emp);
};

// Thêm phòng ban Nhân Sự
const addDefaultPhongBan = async () => {
  const phongBan = {
    maPhongBan: "NS",
    tenPhongBan: "Nhân Sự",
    maQuanLy: "", // Chưa có quản lý
  };
  await writePhongBan(phongBan);
};

// Thêm các chức vụ mặc định
const addDefaultChucVu = async () => {
  const chucVuTP = {
    chucvu_id: "TP",
    hschucvu: "5",
    loaichucvu: "Trưởng Phòng",
  };
  const chucVuGD = {
    chucvu_id: "GD",
    hschucvu: "5",
    loaichucvu: "Giám Đốc",
  };
  const chucVuNV = {
    chucvu_id: "NV",
    hschucvu: "5",
    loaichucvu: "Nhân Viên",
  };
  await createChucVu("TP", chucVuTP);
  await createChucVu("NV", chucVuNV);
  await createChucVu("GD", chucVuGD);
};

