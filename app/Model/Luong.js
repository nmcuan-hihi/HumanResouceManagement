class Luong {
    constructor(luong, phucap) {
        this.luong = luong;
        this.phucap = phucap;
    }

    getLuongDetails() {
        return {
            luong: this.luong,
            phucap: this.phucap
        };
    }

    toString() {
        return `Lương: ${this.luong}, Phụ cấp: ${this.phucap}`;
    }
}
