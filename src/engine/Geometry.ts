import Shader from './Shader';
import Matrix4 from './Matrix4';

const POSITION_SIZE = 2;
const TEXCOORD_SIZE = 2;

class Geometry {
    public position         :       Matrix4;

    private vertices        :       Array<number>;
    private texCoords       :       Array<number>;
    private indices         :       Array<number>;

    private vertexBuffer    :       WebGLBuffer;
    private texCoordBuffer  :       WebGLBuffer;
    private indexBuffer     :       WebGLBuffer;

    private texture         :       WebGLTexture;

    constructor(texture: WebGLTexture) {
        this.vertices = [];
        this.texCoords = [];
        this.indices  = [];

        this.texture = texture;
    }

    public addVertice(x: number, y: number): void {
        this.vertices.push(x, y);
    }

    public addTexCoord(x: number, y: number): void {
        this.texCoords.push(x, y);
    }

    public addTriangle(index1: number, index2: number, index3: number): void {
        if (!this.vertices[index1 * POSITION_SIZE]) { throw new Error("Index [" + index1 + "] doesn't exists!"); }
        if (!this.vertices[index2 * POSITION_SIZE]) { throw new Error("Index [" + index2 + "] doesn't exists!"); }
        if (!this.vertices[index3 * POSITION_SIZE]) { throw new Error("Index [" + index3 + "] doesn't exists!"); }

        this.indices.push(index1, index2, index3);
    }

    public build(gl: WebGLRenderingContext): void {
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }

    public render(gl: WebGLRenderingContext, shader: Shader, camera: Matrix4, uv: Array<number>, zoom: number) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shader.attributes["aVertexPosition"], POSITION_SIZE, gl.FLOAT, false, 0, 0);

        if (shader.attributes["aTextureCoord"] !== undefined) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.vertexAttribPointer(shader.attributes["aTextureCoord"], TEXCOORD_SIZE, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        if (shader.uniforms["uTexture"] !== undefined) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(shader.uniforms["uTexture"], 0);
        }

        gl.uniformMatrix4fv(shader.uniforms["uProjection"], false, camera);
        gl.uniformMatrix4fv(shader.uniforms["uPosition"], false, this.position);
        if (shader.uniforms["uZoom"] !== undefined) { gl.uniform1f(shader.uniforms["uZoom"], zoom); }
        if (shader.uniforms["uUV"] !== undefined) { gl.uniform2fv(shader.uniforms["uUV"], uv); }

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }
}

export default Geometry;