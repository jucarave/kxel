class Matrix4 extends Array {
    constructor(...values: Array<number>) {
        super();

        if (values.length != 16) {
            throw new Error("Matrix4 needs 16 values to be created");
        }

        for (let i=0;i<16;i++) {
            this[i] = values[i];
        }
    }

    public static translate(matrix4: Matrix4, x: number, y: number, z: number = 0, relative: boolean = false): void {
        if (relative) {
            matrix4[12] += x;
            matrix4[13] += y;
            matrix4[14] += z;
        } else {
            matrix4[12] = x;
            matrix4[13] = y;
            matrix4[14] = z;
        }
    }

    public static createIdentity(): Matrix4 {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    public static createOrthoProjection(width: number, height: number, znear: number, zfar: number): Matrix4 {
        let C = 2.0 / width,
            R = 2.0 / height,
            A = -2.0 / (zfar - znear),
            B = -(zfar + znear) / (zfar - znear);

        return new Matrix4(
            C, 0, 0, 0,
            0, R, 0, 0,
            0, 0, A, B,
            0, 0, 0, 1
        );
    }

    public static createOrtho(width: number, height: number, znear: number, zfar: number): Matrix4 {
        let l = -width / 2.0,
            r = width / 2.0,
            b = -height / 2.0,
            t = height / 2.0,
            
            A = 2.0 / (r - l),
            B = 2.0 / (t - b),
            C = -2 / (zfar - znear),
            
            X = -(r + l) / (r - l),
            Y = -(t + b) / (t - b),
            Z = -(zfar + znear) / (zfar - znear);

        return new Matrix4(
            A, 0, 0, X,
            0, B, 0, Y,
            0, 0, C, Z,
            0, 0, 0, 1
        );
    }

    public static createTranslate(x: number, y: number, z: number): Matrix4 {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        );
    };
}

export default Matrix4;