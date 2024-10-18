class CongThucLuongNhanVien {
    constructor(id, maNhanVien, hsLuong, hsLuongTangCa, hsPcChucVu, hsPhucap) {
        this.id = id;
        this.maNhanVien = maNhanVien;
        this.hsLuong = hsLuong;
        this.hsLuongTangCa = hsLuongTangCa;
        this.hsPcChucVu = hsPcChucVu;
        this.hsPhucap = hsPhucap;
    }

    getCongThucLuongNhanVienDetails() {
        return {
            id: this.id,
            maNhanVien: this.maNhanVien,
            hsLuong: this.hsLuong,
            hsLuongTangCa: this.hsLuongTangCa,
            hsPcChucVu: this.hsPcChucVu,
            hsPhucap: this.hsPhucap
        };
    }

    toString() {
        return `Công thức lương cho nhân viên: ${this.maNhanVien}`;
    }
}
