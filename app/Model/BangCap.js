class BangCap {
    constructor(id, tenBang) {
        this.id = id;
        this.tenBang = tenBang;
    }

    getBangCapDetails() {
        return {
            id: this.id,
            tenBang: this.tenBang
        };
    }

    toString() {
        return `Bằng cấp: ${this.tenBang}`;
    }
}
