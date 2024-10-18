class NhiemVuNhanVien {
    constructor(maNhiemVu, maNhanVien) {
        this.maNhiemVu = maNhiemVu;
        this.maNhanVien = maNhanVien;
    }

    getNhiemVuNhanVienDetails() {
        return {
            maNhiemVu: this.maNhiemVu,
            maNhanVien: this.maNhanVien
        };
    }

    toString() {
        return `Nhiệm vụ ID: ${this.maNhiemVu} - Nhân viên: ${this.maNhanVien}`;
    }
}
