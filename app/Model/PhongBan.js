class PhongBan {
    constructor(maPhongBan, tenPhongBan, maQuanLy) {
        this.maPhongBan = maPhongBan;
        this.tenPhongBan = tenPhongBan;
        this.maQuanLy = maQuanLy;
    }

    getPhongBanDetails() {
        return {
            maPhongBan: this.maPhongBan,
            tenPhongBan: this.tenPhongBan,
            maQuanLy: this.maQuanLy
        };
    }

    toString() {
        return `Phòng ban: ${this.tenPhongBan} (ID: ${this.maPhongBan})`;
    }
}
