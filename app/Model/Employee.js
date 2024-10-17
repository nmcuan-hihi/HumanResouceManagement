class Employee {
    constructor(cccd, chucvuId, employeeId, luongcobanId, name, ngaybatdau, ngaysinh, phongbanId, sdt, trangthai = true, imageUrl = "") {
        this.cccd = cccd;                      // Chứng minh nhân dân/căn cước công dân
        this.chucvuId = chucvuId;              // ID chức vụ
        this.employeeId = employeeId;          // ID nhân viên
        this.luongcobanId = luongcobanId;      // ID lương cơ bản
        this.name = name;                      // Tên nhân viên
        this.ngaybatdau = ngaybatdau;          // Ngày bắt đầu làm việc
        this.ngaysinh = ngaysinh;              // Ngày sinh
        this.phongbanId = phongbanId;          // ID phòng ban
        this.sdt = sdt;                        // Số điện thoại
        this.trangthai = trangthai;            // Trạng thái (true/false)
        this.imageUrl = imageUrl;              // URL ảnh của nhân viên
    }

    getEmployeeDetails() {
        return {
            cccd: this.cccd,
            chucvuId: this.chucvuId,
            employeeId: this.employeeId,
            luongcobanId: this.luongcobanId,
            name: this.name,
            ngaybatdau: this.ngaybatdau,
            ngaysinh: this.ngaysinh,
            phongbanId: this.phongbanId,
            sdt: this.sdt,
            trangthai: this.trangthai,
            imageUrl: this.imageUrl,   
        };
    }

    // Phương thức để hiển thị thông tin nhân viên
    toString() {
        return `${this.name} (${this.employeeId}) - Status: ${this.trangthai ? 'Active' : 'Inactive'}`;
    }
}
