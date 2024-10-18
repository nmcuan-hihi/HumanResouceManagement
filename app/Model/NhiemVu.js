class NhiemVu {
    constructor(maNhiemVu, maPhongBan, maNhanVien, batDau, ketThuc, chiTiet) {
        this.maNhiemVu = maNhiemVu;
        this.maPhongBan = maPhongBan;
        this.maNhanVien = maNhanVien;
        this.batDau = batDau;
        this.ketThuc = ketThuc;
        this.chiTiet = chiTiet;
    }

    getNhiemVuDetails() {
        return {
            maNhiemVu: this.maNhiemVu,
            maPhongBan: this.maPhongBan,
            maNhanVien: this.maNhanVien,
            batDau: this.batDau,
            ketThuc: this.ketThuc,
            chiTiet: this.chiTiet
        };
    }

    toString() {
        return `Nhiệm vụ: ${this.maNhiemVu} - Nhân viên: ${this.maNhanVien}`;
    }
}
