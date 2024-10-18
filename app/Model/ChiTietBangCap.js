class ChiTietBangCap {
    constructor(id, loaiBangCap, ngayCap, maNhanVien, hinhAnh, xacThuc, moTa) {
        this.id = id;
        this.loaiBangCap = loaiBangCap;
        this.ngayCap = ngayCap;
        this.maNhanVien = maNhanVien;
        this.hinhAnh = hinhAnh;
        this.xacThuc = xacThuc;
        this.moTa = moTa;
    }

    getChiTietBangCapDetails() {
        return {
            id: this.id,
            loaiBangCap: this.loaiBangCap,
            ngayCap: this.ngayCap,
            maNhanVien: this.maNhanVien,
            hinhAnh: this.hinhAnh,
            xacThuc: this.xacThuc,
            moTa: this.moTa
        };
    }

    toString() {
        return `Bằng cấp: ${this.loaiBangCap} - Nhân viên: ${this.maNhanVien}`;
    }
}
