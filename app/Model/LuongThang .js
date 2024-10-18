class LuongThang {
    constructor(thang, maNhanVien, luongTangCa, thuong, thucNhan, ngayThanhToan, phucap) {
        this.thang = thang;
        this.maNhanVien = maNhanVien;
        this.luongTangCa = luongTangCa;
        this.thuong = thuong;
        this.thucNhan = thucNhan;
        this.ngayThanhToan = ngayThanhToan;
        this.phucap = phucap;
    }

    getLuongThangDetails() {
        return {
            thang: this.thang,
            maNhanVien: this.maNhanVien,
            luongTangCa: this.luongTangCa,
            thuong: this.thuong,
            thucNhan: this.thucNhan,
            ngayThanhToan: this.ngayThanhToan,
            phucap: this.phucap
        };
    }

    toString() {
        return `Lương tháng: ${this.thang} - Nhân viên: ${this.maNhanVien}`;
    }
}
