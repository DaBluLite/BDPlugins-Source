import { Webpack } from "betterdiscord";
import { Filters } from "../../common";

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

const unconfigurable = ["arguments", "caller", "prototype"];

const handler: { [key: string]: any } = {};

const kGET = Symbol.for("vencord.lazy.get");
const kCACHE = Symbol.for("vencord.lazy.cached");

for (const method of [
    "apply",
    "construct",
    "defineProperty",
    "deleteProperty",
    "getOwnPropertyDescriptor",
    "getPrototypeOf",
    "has",
    "isExtensible",
    "ownKeys",
    "preventExtensions",
    "set",
    "setPrototypeOf"
]) {
    handler[method] = (target: any, ...args: any[]) => (Reflect as { [key: string]: any })[method](target[kGET](), ...args);
}

handler.ownKeys = (target: any) => {
    const v = target[kGET]();
    const keys = Reflect.ownKeys(v);
    for (const key of unconfigurable) {
        if (!keys.includes(key)) keys.push(key);
    }
    return keys;
};

handler.getOwnPropertyDescriptor = (target: any, p: any) => {
    if (typeof p === "string" && unconfigurable.includes(p))
        return Reflect.getOwnPropertyDescriptor(target, p);

    const descriptor = Reflect.getOwnPropertyDescriptor(target[kGET](), p);

    if (descriptor) Object.defineProperty(target, p, descriptor);
    return descriptor;
};

export function proxyLazy<T>(factory: () => T, attempts = 5, isChild = false): T {
    let isSameTick = true;
    if (!isChild)
        setTimeout(() => isSameTick = false, 0);

    let tries = 0;
    const proxyDummy = Object.assign(function () { }, {
        [kCACHE]: void 0 as T | undefined,
        [kGET]() {
            if (!proxyDummy[kCACHE] && attempts > tries++) {
                proxyDummy[kCACHE] = factory();
                if (!proxyDummy[kCACHE] && attempts === tries)
                    console.error("Lazy factory failed:", factory);
            }
            return proxyDummy[kCACHE];
        }
    });

    return new Proxy(proxyDummy, {
        ...handler,
        get(target: any, p, receiver) {
            if (!isChild && isSameTick)
                return proxyLazy(
                    () => Reflect.get(target[kGET](), p, receiver),
                    attempts,
                    true
                );
            const lazyTarget = target[kGET]();
            if (typeof lazyTarget === "object" || typeof lazyTarget === "function") {
                return Reflect.get(lazyTarget, p, receiver);
            }
            throw new Error("proxyLazy called on a primitive value");
        }
    }) as any;
}

export function waitForStore(storeName: string, callback: any) {
    Webpack.waitForModule(Filters.byStoreName(storeName)).then((e: any) => callback(e))
}