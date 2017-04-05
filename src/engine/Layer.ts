import Geometry from './Geometry';
import { Color } from './Color';
import { nextPowerOf2 } from './Utils';

class Layer {
    private width           :       number;
    private height          :       number;
    private gl              :       WebGLRenderingContext;
    private imageData       :       Uint8Array;
    private texture         :       WebGLTexture;
    private geometry        :       Geometry;

    private texWidth        :       number;
    private texHeight       :       number;
    private uvLimit         :       Array<number>;

    constructor(width: number, height: number, gl: WebGLRenderingContext) {
        this.width = width;
        this.height = height;
        this.gl = gl;

        this.initTexture(gl);
        this.initGeometryCanvas(gl);
    }

    private initGeometryCanvas(gl: WebGLRenderingContext): void {
        this.geometry = new Geometry(this.texture);

        let l = -Math.floor(this.width / 2), r = Math.floor(this.width / 2),
            t = Math.floor(this.height / 2), b = -Math.floor(this.height / 2);

        if (this.width % 2 != 0) { r += 1; }
        if (this.height % 2 != 0) { t += 1; }

        this.geometry.addVertice(l, b);
        this.geometry.addVertice(r, b);
        this.geometry.addVertice(l, t);
        this.geometry.addVertice(r, t);

        this.geometry.addTexCoord(0.0, 1.0);
        this.geometry.addTexCoord(1.0, 1.0);
        this.geometry.addTexCoord(0.0, 0.0);
        this.geometry.addTexCoord(1.0, 0.0);

        this.geometry.addTriangle(0, 1, 2);
        this.geometry.addTriangle(1, 3, 2);

        this.geometry.build(gl);
    }

    private initTexture(gl: WebGLRenderingContext): void {
        this.texWidth = nextPowerOf2(this.width);
        this.texHeight = nextPowerOf2(this.height);
        this.uvLimit = [this.texWidth / this.width, this.texHeight / this.height];

        this.imageData = new Uint8Array(this.texWidth * this.texHeight * 4);
        for (let i=0;i<this.texWidth*this.texHeight*4;i+=4) {
            this.imageData[i] = 0;
            this.imageData[i + 1] = 0;
            this.imageData[i + 2] = 0;
            this.imageData[i + 3] = 0;
        }

        this.texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.texWidth, this.texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    private updateTexture(): void {
        let gl: WebGLRenderingContext = this.gl;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.texWidth, this.texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.imageData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public get geometryCanvas(): Geometry {
        return this.geometry;
    }

    public get uv(): Array<number> {
        return this.uvLimit;
    }

    public plot(x: number, y: number, color: Color) {
        let idx = (y * this.texWidth + x) * 4;

        this.imageData[idx] = color.r;
        this.imageData[idx + 1] = color.g;
        this.imageData[idx + 2] = color.b;
        this.imageData[idx + 3] = color.a;

        this.updateTexture();
    }
}

export default Layer;