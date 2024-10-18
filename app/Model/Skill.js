class Skill {
    constructor(id, tenSkill) {
        this.id = id;
        this.tenSkill = tenSkill;
    }

    getSkillDetails() {
        return {
            id: this.id,
            tenSkill: this.tenSkill
        };
    }

    toString() {
        return `Kỹ năng: ${this.tenSkill}`;
    }
}
