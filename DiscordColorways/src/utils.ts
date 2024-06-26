export function HexToHSL(H: string) {
    let r: any = 0, g: any = 0, b: any = 0;
    if (H.length === 4) r = "0x" + H[1] + H[1], g = "0x" + H[2] + H[2], b = "0x" + H[3] + H[3];
    else if (H.length === 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    r /= 255, g /= 255, b /= 255;
    var cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta === 0
        ? 0
        : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [Math.round(h), Math.round(s), Math.round(l)];
}

export const canonicalizeHex = (hex: string) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = hex;
    hex = ctx.fillStyle;
    canvas.remove();

    return hex;
};

export const stringToHex = (str: string) => {
    let hex = "";
    for (
        let i = 0;
        i < str.length;
        i++
    ) {
        const charCode = str.charCodeAt(i);
        const hexValue = charCode.toString(16);
        hex += hexValue.padStart(2, "0");
    }
    return hex;
};

export const hexToString = (hex: string) => {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        const hexValue = hex.substr(i, 2);
        const decimalValue = parseInt(hexValue, 16);
        str += String.fromCharCode(decimalValue);
    }
    return str;
};

export function getHex(str: string): string {
    const color = Object.assign(
        document.createElement("canvas").getContext("2d") as {},
        { fillStyle: str }
    ).fillStyle;
    if (color.includes("rgba(")) {
        return getHex(String([...color.split(",").slice(0, 3), ")"]).replace(",)", ")").replace("a", ""));
    } else {
        return color;
    }
}

export function getFontOnBg(bgColor: string) {
    var color = (bgColor.charAt(0) === "#") ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16);
    var g = parseInt(color.substring(2, 4), 16);
    var b = parseInt(color.substring(4, 6), 16);
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
        "#000000" : "#ffffff";
}

export function $e(funcArray: Array<(...vars: any) => void>, ...vars: any[]) {
    funcArray.forEach(e => e(vars));
}