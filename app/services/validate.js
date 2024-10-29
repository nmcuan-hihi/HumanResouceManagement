// Validate employee data
export const validateEmployeeData = (data) => {
    const {
        cccd,
        name,
        diachi,
        sdt,
        luongcoban,
        ngaysinh,
        ngaybatdau,
        matKhau,
    } = data;

    const errors = [];

    if (!cccd) {
        errors.push('Mã số CCCD không được để trống.');
    }
    if (!name) {
        errors.push('Họ tên không được để trống.');
    }
    if (!diachi) {
        errors.push('Địa chỉ không được để trống.');
    }
    if (!sdt) {
        errors.push('Số điện thoại không được để trống.');
    }
    if (!luongcoban) {
        errors.push('Lương cơ bản không được để trống.');
    }
    if (!ngaysinh) {
        errors.push('Ngày sinh không được để trống.');
    }
    if (!ngaybatdau) {
        errors.push('Ngày bắt đầu không được để trống.');
    }
    if (!matKhau) {
        errors.push('Mật khẩu không được để trống.');
    }

    return errors; 
};

export const validatePhongBanData = (data) => {
    const { maPhongBan, tenPhongBan, selectedManager } = data;

    const errors = [];

    if (!maPhongBan) {
        errors.push('Mã phòng ban không được để trống.');
    }
    if (!tenPhongBan) {
        errors.push('Tên phòng ban không được để trống.');
    }
  
    return errors; 
};


export const validateChucVuData = (data) => {
    const { chucvu_id, loaichucvu, hschucvu } = data;

    const errors = [];

    if (!chucvu_id) {
        errors.push('ID chức vụ không được để trống.');
    }
    if (!loaichucvu) {
        errors.push('Loại chức vụ không được để trống.');
    }
    if (!hschucvu) {
        errors.push('Hệ số chức vụ không được để trống.');
    }
    if (isNaN(hschucvu) || hschucvu <= 0) {
        return "Hệ số chức vụ phải là số dương."; 
      }

    return errors; 
};


export const validateBangCapData = (data) => {
    const { bangcap_id, tenBang } = data;

    const errors = [];

    if (!bangcap_id) {
        errors.push('ID bằng cấp không được để trống.');
    }
    if (!tenBang) {
        errors.push('Tên bằng cấp không được để trống.');
    }

    return errors; 
};

export const validateSkillData = (data) => {
    const { id, tenSkill } = data;

    const errors = [];

    if (!id) {
        errors.push('ID kỹ năng không được để trống.');
    }
    if (!tenSkill) {
        errors.push('Tên kỹ năng không được để trống.');
    }

    return errors; 
};

