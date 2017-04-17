import Renderer from './Renderer';
import Layer from './Layer';
import Matrix4 from './Matrix4';
import { ShaderType } from '../shaders/ShaderStructure';
import { Vector2, vec2 } from './Vector2';

const ZOOM_BASE = 4;

class Sprite {
    private background  :       Layer;
    private layers      :       Array<Layer>;
    private zoomIndex   :       number
    private pos    :       Matrix4;

    private static zoomLevels: Array<number> = [ 0.0625, 0.125, 0.25, 0.5, 1, 2, 3, 4, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 70 ];

    public readonly layer       :           Layer;

    constructor(private width: number, private height: number, private renderer: Renderer) {
        this.layers = [];
        this.zoomIndex = ZOOM_BASE;
        this.pos = Matrix4.createTranslate(0, 0, 0);

        this.initTransparentLayer();
        this.addLayer();

        this.layer = this.layers[0];
    }

    private initTransparentLayer(): void {
        let layer = new Layer(this.width, this.height, this.renderer.GL);
        layer.geometryCanvas.position = this.pos;

        this.background = layer;
    }

    public addLayer(): void {
        let layer = new Layer(this.width, this.height, this.renderer.GL);
        layer.geometryCanvas.position = this.pos;
        
        this.layers.push(layer);
    }

    public render(): void {
        this.renderer.render(this.background, this.zoom, ShaderType.TRANSPARENT);

        for (let i=0,layer: Layer;layer=this.layers[i];i++) {
            this.renderer.render(layer, this.zoom);
        }
    }

    public get zoom(): number {
        return Sprite.zoomLevels[this.zoomIndex];
    }

    public get nextZoom(): number {
        return Sprite.zoomLevels[this.zoomIndex + 1];
    }

    public get prevZoom(): number {
        return Sprite.zoomLevels[this.zoomIndex - 1];
    }

    public get position(): Matrix4 {
        return this.pos;
    }

    public zoomIn(): void {
        if (Sprite.zoomLevels[this.zoomIndex + 1] !== undefined) { 
            this.zoomIndex += 1;
        }
    }

    public zoomOut(): void {
        if (Sprite.zoomLevels[this.zoomIndex - 1] !== undefined) { 
            this.zoomIndex -= 1;
        }
    }

    public resetZoom(): void {
        this.zoomIndex = ZOOM_BASE;
    }

    public screenCoordsToLocalPixels(sx: number, sy: number): Vector2 {
        let ret: Vector2 = null;

        let x = Math.floor((sx - this.position[12]) / this.zoom + this.width / 2),
            y = Math.floor((this.position[13] - sy) / this.zoom + this.height / 2);

        if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
            ret = vec2(x, y);
        }

        return ret;
    }
}

export default Sprite;