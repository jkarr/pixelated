class Color {
    constructor(name, hexValue, shortCode) {
        this.name = name;
        this.hexValue = hexValue;
        this.shortCode = shortCode;
    }

    clone() {
        return new Color(this.name, this.hexValue, this.shortCode);
    }

    static colors = [
        new Color("Gray", "#708090", "g"),
        new Color("Blue", "#005AB5", "b"),
        new Color("Red", "#D73027", "r"),
        new Color("Green", "#33A02C", "g"),
        new Color("Purple", "#6A3D9A", "p"),
        new Color("Orange", "#E69F00", "o")
    ];

    static colorCounts = [];

    static initColorCounts() {
        this.colorCounts = [];
        for (let c = 0; c < this.colors.length; c++) {
            this.colorCounts[this.colors[c].name] = 0;
        }
    }

    static increaseColorCount(colorName) {
        this.colorCounts[colorName]++;
    }

    static decreaseColorCount(colorName) {
        this.colorCounts[colorName]--;
    }

    static getRandomColor() {
        let randomIndex = Math.floor(Math.random() * Color.colors.length);
        return Color.colors[randomIndex];
    }
}

export default Color;