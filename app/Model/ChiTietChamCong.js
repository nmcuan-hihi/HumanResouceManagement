class ChiTietChamCong {
    constructor(maLuongThang, maChamCong, maNhanVien, ngayLamViec, gioVao, gioRa, gioTangCa, diMuon, vangMat, loaiNghi = 'Không') {
        this.maLuongThang = maLuongThang;
        this.maChamCong = maChamCong;
        this.maNhanVien = maNhanVien;
        this.ngayLamViec = ngayLamViec;
        this.gioVao = gioVao;
        this.gioRa = gioRa;
        this.gioTangCa = gioTangCa;
        this.diMuon = diMuon;
        this.vangMat = vangMat;
        this.loaiNghi = loaiNghi;
    }

    getChiTietChamCongDetails() {
        return {
            maLuongThang: this.maLuongThang,
            maChamCong: this.maChamCong,
            maNhanVien: this.maNhanVien,
            ngayLamViec: this.ngayLamViec,
            gioVao: this.gioVao,
            gioRa: this.gioRa,
            gioTangCa: this.gioTangCa,
            diMuon: this.diMuon,
            vangMat: this.vangMat,
            loaiNghi: this.loaiNghi
        };
    }

    toString() {
        return `Chấm công ID: ${this.maChamCong} - Nhân viên: ${this.maNhanVien}`;
    }
}
