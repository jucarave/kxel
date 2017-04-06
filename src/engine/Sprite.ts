import Renderer from './Renderer';
import Layer from './Layer';

class Sprite {
    private background  :       Layer;
    private layers      :       Array<Layer>;
    private zoomIndex   :       number

    private static zoomLevels: Array<number> = [0.0625, 0.125, 0.25, 0.5, 1, 2, 3, 4, 6, 8, 10];

    constructor(private width: number, private height: number, private renderer: Renderer) {
        this.layers = [];
        this.zoomIndex = 4;

        this.initTransparentLayer();
        this.addLayer();
    }

    private initTransparentLayer(): void {
        let layer = new Layer(this.width, this.height, this.renderer.GL);
        this.background = layer;
    }

    public addLayer(): void {
        let layer = new Layer(this.width, this.height, this.renderer.GL);
        this.layers.push(layer);
    }

    public render(): void {
        this.renderer.render(this.background, this.zoom, "TRANSPARENT");

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
}

export default Sprite;