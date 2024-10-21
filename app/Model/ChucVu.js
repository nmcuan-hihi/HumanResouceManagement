class ChucVu {
    constructor(chucvu_id, loaichucvu, hschucvu) {
        this.chucvu_id = chucvu_id; 
        this.loaichucvu = loaichucvu;
        this.hschucvu = hschucvu;
    }

    getChucVuDetails() {
        return {
            id: this.id,
            loaichucvu: this.loaichucvu,
            hschucvu: this.hschucvu
        };
    }

    toString() {
        return `Chức vụ: ${this.loaichucvu} (ID: ${this.chucvu_id})`;
    }
}
