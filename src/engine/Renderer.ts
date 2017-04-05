import Shader from './Shader';
import Geometry from './Geometry';
import Matrix4 from './Matrix4';
import BasicShader from '../shaders/BasicShader';

class Renderer {
    private canvas           :         HTMLCanvasElement;
    private gl               :         WebGLRenderingContext;
    private shader           :         Shader;
    private camera           :         Matrix4;

    constructor(private width: number, private height: number, container?: HTMLElement) {
        this.createCanvas(width, height, container);
        this.initGL();
        this.loadShader();
        this.initCamera();
    }

    private createCanvas(width: number, height: number, container?: HTMLElement): void {
        let canvas: HTMLCanvasElement = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        if (container) {
            container.appendChild(canvas);
        }

        this.canvas = canvas;
    }

    private getGLContext(): void {
        let gl: WebGLRenderingContext = this.canvas.getContext("webgl");

        if (!gl) {
            throw new Error("Cannot initialize WebGL Context");
        }

        this.gl = gl;
    }

    private initGL(): void {
        this.getGLContext();

        let gl: WebGLRenderingContext = this.gl;

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.325, 0.435, 0.592, 1.0);
    }

    private loadShader(): void {
        this.shader = new Shader(this.gl, BasicShader);
        this.shader.useProgram();
    }

    private initCamera(): void {
        this.camera = Matrix4.createOrtho(this.width, this.height, 0.1, 100);
    }

    public get GL(): WebGLRenderingContext {
        return this.gl;
    }

    public clear(): void {
        let gl: WebGLRenderingContext = this.gl;

        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    }

    public render(geometry: Geometry, uv: Array<number>, zoom: number): void {
        geometry.render(this.gl, this.shader, this.camera, uv, zoom);
    }
}

export default Renderer;