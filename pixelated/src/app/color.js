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
        new Color("Yellow", "#FFFF00", "y"),
        new Color("Blue", "#0000FF", "b"),
        new Color("Red", "#FF0000", "r"),
        new Color("Green", "#008000", "g"),
        new Color("Purple", "#391492", "p")
    ];

    static colorCounts = [];

    static initColorCounts() {
        this.colorCounts = [];
        for (let c = 0; c < this.colors.length; c++) {
            this.colorCounts[this.colors[c].name] = 0;
        }

        console.log(this.colorCounts);
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