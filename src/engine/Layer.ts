import Geometry from './Geometry';
import { nextPowerOf2 } from './Utils';

class Layer {
    private width           :       number;
    private height          :       number;
    private gl              :       WebGLRenderingContext;
    private texture         :       WebGLTexture;
    private geometry        :       Geometry;

    private imageData       :       ArrayBuffer;
    private data8b          :       Uint8Array;
    private data32          :       Uint32Array;

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

        this.imageData = new ArrayBuffer(this.texWidth * this.texHeight * 4);
        this.data8b    = new Uint8Array(this.imageData);
        this.data32    = new Uint32Array(this.imageData);

        for (let i=0;i<this.texWidth*this.texHeight;i++) {
            this.data32[i] = 0;
        }

        this.texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.texWidth, this.texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.data8b);
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
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.texWidth, this.texHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.data8b);
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

    public plot(x: number, y: number, color: number) {
        let idx = (y * this.texWidth + x);

        this.data32[idx] = color;

        this.updateTexture();
    }
}

export default Layer;