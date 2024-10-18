class KyLuat {
    constructor(id, tenKyLuat, mucDoKyLuat) {
        this.id = id;
        this.tenKyLuat = tenKyLuat;
        this.mucDoKyLuat = mucDoKyLuat;
    }

    getKyLuatDetails() {
        return {
            id: this.id,
            tenKyLuat: this.tenKyLuat,
            mucDoKyLuat: this.mucDoKyLuat
        };
    }

    toString() {
        return `Kỷ luật: ${this.tenKyLuat} - Mức độ: ${this.mucDoKyLuat}`;
    }
}
