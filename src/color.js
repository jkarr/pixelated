class Color {
    constructor(name, hexValue, shortCode, usedCount) {
        this.name = name;
        this.hexValue = hexValue;
        this.shortCode = shortCode;
        this.usedCount = usedCount;
    }

    clone() {
        return new Color(this.name, this.hexValue, this.shortCode, this.usedCount);
    }
}

export default Color;