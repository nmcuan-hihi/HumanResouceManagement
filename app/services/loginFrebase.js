import {
  getDatabase,
  ref,
  set,
  get,
} from "firebase/database";
import { app } from "../config/firebaseconfig";
import { addEmployeeFireStore } from "./EmployeeFireBase";

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

// Hàm thêm công ty vào cơ sở dữ liệu (giữ nguyên ref của bạn)
export const addCompany = async (idCongTy, tenCongTy, tenGiamDoc, sdt) => {
  try {
    const companyRef = ref(database, `${idCongTy}/data`);

    // Dữ liệu công ty cần lưu
    const companyData = {
      tenCongTy,
      tenGiamDoc,
      sdt,
    };

    // Thêm dữ liệu vào Firebase
    await set(companyRef, companyData);

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

    }
    await addEmployeeFireStore(emp)
    console.log("Thêm công ty thành công!");
    return true; // Thêm thành công
  } catch (error) {
    console.error("Lỗi khi thêm công ty:", error);
    return false; // Thêm thất bại
  }
};
