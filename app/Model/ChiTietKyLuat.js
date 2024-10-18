class ChiTietKyLuat {
    constructor(id, tieuDe, ngayViPham, maNhanVien, noiDung) {
        this.id = id;
        this.tieuDe = tieuDe;
        this.ngayViPham = ngayViPham;
        this.maNhanVien = maNhanVien;
        this.noiDung = noiDung;
    }

    getChiTietKyLuatDetails() {
        return {
            id: this.id,
            tieuDe: this.tieuDe,
            ngayViPham: this.ngayViPham,
            maNhanVien: this.maNhanVien,
            noiDung: this.noiDung
        };
    }

    toString() {
        return `Kỷ luật: ${this.tieuDe} - Nhân viên: ${this.maNhanVien}`;
    }
}
