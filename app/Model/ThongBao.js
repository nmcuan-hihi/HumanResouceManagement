class ThongBao {
    constructor(maThongBao, maNhanVien, loaiThongBao, thongDiep, ngayThongBao, trangThai = 'Chưa đọc') {
        this.maThongBao = maThongBao;
        this.maNhanVien = maNhanVien;
        this.loaiThongBao = loaiThongBao;
        this.thongDiep = thongDiep;
        this.ngayThongBao = ngayThongBao;
        this.trangThai = trangThai;
    }

    getThongBaoDetails() {
        return {
            maThongBao: this.maThongBao,
            maNhanVien: this.maNhanVien,
            loaiThongBao: this.loaiThongBao,
            thongDiep: this.thongDiep,
            ngayThongBao: this.ngayThongBao,
            trangThai: this.trangThai
        };
    }

    toString() {
        return `Thông báo ID: ${this.maThongBao} - Nhân viên: ${this.maNhanVien}`;
    }
}
