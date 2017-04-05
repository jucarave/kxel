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