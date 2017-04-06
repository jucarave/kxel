import Renderer from './Renderer';
import Layer from './Layer';
class Sprite {
    private layers      :       Array<Layer>;
    private zoom        :       number;

    constructor(private width: number, private height: number, private renderer: Renderer) {
        this.layers = [];
        this.zoom = 1;

        this.initTransparentLayer();
    }

    private initTransparentLayer(): void {
        let w = this.width,
            h = this.height;

        let layer = new Layer(w, h, this.renderer.GL);

        this.layers.push(layer);
    }

    public render(): void {
        for (let i=0,layer: Layer;layer=this.layers[i];i++) {
            this.renderer.render(layer.geometryCanvas, layer.uv, this.zoom, "TRANSPARENT");
        }
    }
}

export default Sprite;