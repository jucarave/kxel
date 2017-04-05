export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

function col(r: number, g: number, b: number, a: number): Color {
    return { r, g, b, a }
}

export { col };