class ChiTietKhenThuong {
    constructor(id, tieuDe, ngayKhenThuong, noiDung, maNhanVien, tienThuong) {
        this.id = id;
        this.tieuDe = tieuDe;
        this.ngayKhenThuong = ngayKhenThuong;
        this.noiDung = noiDung;
        this.maNhanVien = maNhanVien;
        this.tienThuong = tienThuong;
    }

    getChiTietKhenThuongDetails() {
        return {
            id: this.id,
            tieuDe: this.tieuDe,
            ngayKhenThuong: this.ngayKhenThuong,
            noiDung: this.noiDung,
            maNhanVien: this.maNhanVien,
            tienThuong: this.tienThuong
        };
    }

    toString() {
        return `Khen thưởng cho nhân viên: ${this.maNhanVien} - Tiêu đề: ${this.tieuDe}`;
    }
}
