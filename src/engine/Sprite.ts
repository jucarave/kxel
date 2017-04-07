import Renderer from './Renderer';
import Layer from './Layer';
import Matrix4 from './Matrix4';
import { ShaderType } from '../shaders/ShaderStructure';

const ZOOM_BASE = 4;

class Sprite {
    private background  :       Layer;
    private layers      :       Array<Layer>;
    private zoomIndex   :       number
    private position    :       Matrix4;

    private static zoomLevels: Array<number> = [ 0.0625, 0.125, 0.25, 0.5, 1, 2, 3, 4, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 70 ];

    constructor(private width: number, private height: number, private renderer: Renderer) {
        this.layers = [];
        this.zoomIndex = ZOOM_BASE;
        this.position = Matrix4.createTranslate(0, 0, 0);

        this.initTransparentLayer();
        this.addLayer();
    }

    private initTransparentLayer(): void {
        let layer = new Layer(this.width, this.height, this.renderer.GL);
        layer.geometryCanvas.position = this.position;

        this.background = layer;
    }

    public addLayer(): void {
        let layer = new Layer(this.width, this.height, this.renderer.GL);
        layer.geometryCanvas.position = this.position;
        
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
}

export default Sprite;