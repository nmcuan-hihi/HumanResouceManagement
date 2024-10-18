class ChiTietSkill {
    constructor(id, maNhanVien, maSkill, moTa) {
        this.id = id;
        this.maNhanVien = maNhanVien;
        this.maSkill = maSkill;
        this.moTa = moTa;
    }

    getChiTietSkillDetails() {
        return {
            id: this.id,
            maNhanVien: this.maNhanVien,
            maSkill: this.maSkill,
            moTa: this.moTa
        };
    }

    toString() {
        return `Kỹ năng ID: ${this.maSkill} - Nhân viên: ${this.maNhanVien}`;
    }
}
