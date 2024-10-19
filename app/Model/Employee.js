class Employee {
    constructor(
        cccd, 
        chucvuId, 
        employeeId, 
        luongcoban, 
        name, 
        ngaybatdau, 
        ngaysinh, 
        phongbanId, 
        diachi, 
        sdt, 
        matKhau, 
        gioitinh = "Nam", 
        trangthai = true, 
        imageUrl = ""
    ) {
        this.cccd = cccd;                      
        this.chucvuId = chucvuId;              
        this.employeeId = employeeId;          
        this.luongcoban = luongcoban; 
        this.name = name;                      
        this.ngaybatdau = ngaybatdau;          
        this.ngaysinh = ngaysinh;              
        this.phongbanId = phongbanId;          
        this.diachi = diachi; 
        this.sdt = sdt;                        
        this.matKhau = matKhau; 
        this.gioitinh = gioitinh;              
        this.trangthai = trangthai;            
        this.imageUrl = imageUrl;              
    }

    // Phương thức lấy thông tin nhân viên
    getEmployeeDetails() {
        return {
            cccd: this.cccd,
            chucvuId: this.chucvuId,
            employeeId: this.employeeId,
            luongcoban: this.luongcoban, 
            name: this.name,
            ngaybatdau: this.ngaybatdau,
            ngaysinh: this.ngaysinh,
            phongbanId: this.phongbanId,
            diachi: this.diachi, 
            sdt: this.sdt,
            matKhau: this.matKhau, 
            gioitinh: this.gioitinh,
            trangthai: this.trangthai,
            imageUrl: this.imageUrl,
        };
    }

    // Phương thức hiển thị thông tin nhân viên dưới dạng chuỗi
    toString() {
        return `${this.name} (${this.employeeId}) - Giới tính: ${this.gioitinh} - Status: ${this.trangthai ? 'Active' : 'Inactive'}`;
    }
}
