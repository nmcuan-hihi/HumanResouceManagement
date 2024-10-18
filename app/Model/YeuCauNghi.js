class YeuCauNghi {
    constructor(maNghi, maNhanVien, ngayBatDau, ngayKetThuc, loaiNghi, trangThai = 'Đang chờ', lyDo = '') {
        this.maNghi = maNghi;
        this.maNhanVien = maNhanVien;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.loaiNghi = loaiNghi;
        this.trangThai = trangThai;
        this.lyDo = lyDo;
    }

    getYeuCauNghiDetails() {
        return {
            maNghi: this.maNghi,
            maNhanVien: this.maNhanVien,
            ngayBatDau: this.ngayBatDau,
            ngayKetThuc: this.ngayKetThuc,
            loaiNghi: this.loaiNghi,
            trangThai: this.trangThai,
            lyDo: this.lyDo
        };
    }

    toString() {
        return `Yêu cầu nghỉ của nhân viên: ${this.maNhanVien} - Trạng thái: ${this.trangThai}`;
    }
}
