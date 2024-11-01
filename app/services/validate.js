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
    } else if (!/^\d{12}$/.test(cccd)) {
        errors.push('Mã số CCCD phải là 12 chữ số.');
    }

    if (!name) {
        errors.push('Họ tên không được để trống.');
    } else if (name.length < 2 || name.length > 50) {
        errors.push('Họ tên phải có từ 2 đến 50 ký tự.');
    }

    if (!diachi) {
        errors.push('Địa chỉ không được để trống.');
    } else if (diachi.length < 5 || diachi.length > 100) {
        errors.push('Địa chỉ phải có từ 5 đến 100 ký tự.');
    }

    if (!sdt) {
        errors.push('Số điện thoại không được để trống.');
    } else if (!/^\d{10,11}$/.test(sdt)) {
        errors.push('Số điện thoại phải có 10 đến 11 chữ số.');
    }

    if (!luongcoban) {
        errors.push('Lương cơ bản không được để trống.');
    } else if (isNaN(luongcoban) || luongcoban <= 0) {
        errors.push('Lương cơ bản phải là số dương.');
    }

    if (!ngaysinh) {
        errors.push('Ngày sinh không được để trống.');
    } else if (new Date(ngaysinh) > new Date()) {
        errors.push('Ngày sinh không hợp lệ.');
    }

    if (!ngaybatdau) {
        errors.push('Ngày bắt đầu không được để trống.');
    } else if (new Date(ngaybatdau) < new Date(ngaysinh)) {
        errors.push('Ngày bắt đầu không được trước ngày sinh.');
    }

    return errors;
};

// Validate department data
export const validatePhongBanData = (data) => {
    const { maPhongBan, tenPhongBan } = data;

    const errors = [];

    if (!maPhongBan) {
        errors.push('Mã phòng ban không được để trống.');
    } else if (!/^[A-Za-z0-9]{2,10}$/.test(maPhongBan)) {
        errors.push('Mã phòng ban phải từ 2-10 ký tự, chỉ chứa chữ cái và số.');
    }

    if (!tenPhongBan) {
        errors.push('Tên phòng ban không được để trống.');
    } else if (tenPhongBan.length < 3 || tenPhongBan.length > 50) {
        errors.push('Tên phòng ban phải có từ 3 đến 50 ký tự.');
    }

    return errors;
};

// Validate position data
export const validateChucVuData = (data) => {
    const { chucvu_id, loaichucvu, hschucvu } = data;

    const errors = [];

    if (!chucvu_id) {
        errors.push('ID chức vụ không được để trống.');
    } else if (!/^[A-Za-z0-9]+$/.test(chucvu_id)) {
        errors.push('ID chức vụ chỉ chứa chữ cái và số.');
    }

    if (!loaichucvu) {
        errors.push('Loại chức vụ không được để trống.');
    } else if (loaichucvu.length < 2 || loaichucvu.length > 30) {
        errors.push('Loại chức vụ phải có từ 2 đến 30 ký tự.');
    }

    if (!hschucvu) {
        errors.push('Hệ số chức vụ không được để trống.');
    } else if (isNaN(hschucvu) || hschucvu <= 0) {
        errors.push('Hệ số chức vụ phải là số dương.');
    }

    return errors;
};

// Validate degree data
export const validateBangCapData = (data) => {
    const { bangcap_id, tenBang } = data;

    const errors = [];

    if (!bangcap_id) {
        errors.push('ID bằng cấp không được để trống.');
    } else if (!/^[A-Za-z0-9]+$/.test(bangcap_id)) {
        errors.push('ID bằng cấp chỉ chứa chữ cái và số.');
    }

    if (!tenBang) {
        errors.push('Tên bằng cấp không được để trống.');
    } else if (tenBang.length < 3 || tenBang.length > 50) {
        errors.push('Tên bằng cấp phải có từ 3 đến 50 ký tự.');
    }

    return errors;
};

// Validate skill data
export const validateSkillData = (data) => {
    const { id, tenSkill } = data;

    const errors = [];

    if (!id) {
        errors.push('ID kỹ năng không được để trống.');
    } else if (!/^[A-Za-z0-9]+$/.test(id)) {
        errors.push('ID kỹ năng chỉ chứa chữ cái và số.');
    }

    if (!tenSkill) {
        errors.push('Tên kỹ năng không được để trống.');
    } else if (tenSkill.length < 3 || tenSkill.length > 30) {
        errors.push('Tên kỹ năng phải có từ 3 đến 30 ký tự.');
    }

    return errors;
};
