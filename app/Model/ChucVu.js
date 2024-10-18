class ChucVu {
    constructor(id, loaiChucVu, hsChucVu) {
        this.id = id; 
        this.loaiChucVu = loaiChucVu;
        this.hsChucVu = hsChucVu;
    }

    getChucVuDetails() {
        return {
            id: this.id,
            loaiChucVu: this.loaiChucVu,
            hsChucVu: this.hsChucVu
        };
    }

    toString() {
        return `Chức vụ: ${this.loaiChucVu} (ID: ${this.id})`;
    }
}
