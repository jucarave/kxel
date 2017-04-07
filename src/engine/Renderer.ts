import Shader from './Shader';
import Layer from './Layer';
import Matrix4 from './Matrix4';
import BasicShader from '../shaders/BasicShader';
import TransparentShader from '../shaders/TransparentShader';
import { ShaderMap } from '../shaders/ShaderStructure';

class Renderer {
    private canvas           :         HTMLCanvasElement;
    private gl               :         WebGLRenderingContext;
    private shaders          :         ShaderMap;
    private camera           :         Matrix4;

    constructor(private width: number, private height: number, container?: HTMLElement) {
        this.createCanvas(width, height, container);
        this.initGL();
        this.loadShaders();
        this.initCamera();
    }

    private createCanvas(width: number, height: number, container?: HTMLElement): void {
        let canvas: HTMLCanvasElement = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        if (container) {
            container.appendChild(canvas);
        }

        canvas.addEventListener('contextmenu', event => event.preventDefault());

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

        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.325, 0.435, 0.592, 1.0);
    }

    private loadShaders(): void {
        this.shaders = {};
        this.shaders["BASIC"]       = new Shader(this.gl, BasicShader);
        this.shaders["TRANSPARENT"] = new Shader(this.gl, TransparentShader);
    }

    private initCamera(): void {
        this.camera = Matrix4.createOrtho(this.width, this.height, 0.1, 100);
    }

    public get GL(): WebGLRenderingContext {
        return this.gl;
    }

    public get canvasX(): number {
        return this.canvas.offsetLeft;
    }

    public get canvasY(): number {
        return this.canvas.offsetTop;
    }

    public get canvasWidth(): number {
        return this.width;
    }

    public get canvasHeight(): number {
        return this.height;
    }

    public clear(): void {
        let gl: WebGLRenderingContext = this.gl;

        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    }

    public render(layer: Layer, zoom: number, shaderIndex: string = "BASIC"): void {
        let shader = this.shaders[shaderIndex];
        shader.useProgram();

        layer.geometryCanvas.render(this.gl, shader, this.camera, layer.uv, zoom);
    }
}

export default Renderer;