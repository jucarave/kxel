import Renderer from './Renderer';
import Layer from './Layer';
import { col } from './Color';

class Sprite {
    private layers      :       Array<Layer>;
    private zoom        :       number;

    constructor(private width: number, private height: number, private renderer: Renderer) {
        this.layers = [];
        this.zoom = 1;

        this.initTransparentLayer();
    }

    private initTransparentLayer(): void {
        let w = this.width + 2,
            h = this.height + 2,
            black = col(255, 0, 0, 255);

        let layer = new Layer(w, h, this.renderer.GL);

        for (let i=0;i<w;i++) {
            layer.plot(i,     0, black);
            layer.plot(i, h - 1, black);
        }

        for (let i=0;i<h;i++) {
            layer.plot(0,     i, black);
            layer.plot(w - 1, i, black);
        }

        this.layers.push(layer);
    }

    public render(): void {
        for (let i=0,layer: Layer;layer=this.layers[i];i++) {
            this.renderer.render(layer.geometryCanvas, layer.uv, this.zoom);
        }
    }
}

export default Sprite;