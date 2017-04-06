export function nextPowerOf2(num: number) {
    if (isPowerOf2(num)) {
        return num;
    }
    
    let ret = 1;
    while (ret < num) {
        ret *= 2;
    }

    return ret;
}

export function isPowerOf2(num: number) {
    return (num != 0) && ((num & (num - 1)) == 0);
}

let buffer: ArrayBuffer = new ArrayBuffer(4),
    data8: Uint8Array = new Uint8Array(buffer),
    data32: Uint32Array = new Uint32Array(buffer),
    little = true;;

data32[0] = 0x0a0b0c0d;

if (data8[0] == 0x0a && data8[1] == 0x0b && data8[2] == 0x0c && data8[3] == 0x0d) {
    little = false;
}

data8 = null; data32 = null; buffer = null;

export const LITTLE_ENDIAN = little;

export function col(r: number, g: number, b: number, a: number): number {
    if (LITTLE_ENDIAN) {
        return (a << 24 | b << 16 | g << 8 | r);
    } else {
        return (r << 24 | g << 16 | b << 8 | a);
    }
}

export function $(elementId: string): HTMLElement {
    var type = elementId.charAt(0);
    elementId = elementId.replace(type, "");

    if (type == "#") {
        return document.getElementById(elementId);
    }
}