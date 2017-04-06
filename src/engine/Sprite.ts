import Renderer from './Renderer';
import Layer from './Layer';

class Sprite {
    private background  :       Layer;
    private layers      :       Array<Layer>;
    private zoom        :       number;

    constructor(private width: number, private height: number, private renderer: Renderer) {
        this.layers = [];
        this.zoom = 1;

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
}

export default Sprite;