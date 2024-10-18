class BangCap {
    constructor(id, tenBang) {
        this.bangcap_id = id;
        this.tenBang = tenBang;
        
    }

    getBangCapDetails() {
        return {
            bangcap_id: this.bangcap_id,
            tenBang: this.tenBang
        };
    }

    toString() {
        return `Bằng cấp: ${this.tenBang}`;
    }
}
