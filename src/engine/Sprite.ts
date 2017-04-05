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
            black = col(0, 0, 0, 255),
            pat1 = col(60, 60, 60, 255),
            pat2 = col(122, 122, 122, 255);

        let layer = new Layer(w, h, this.renderer.GL);

        for (let i=0;i<w;i++) {
            layer.plot(i,     0, black);
            layer.plot(i, h - 1, black);
        }

        for (let i=0;i<h;i++) {
            layer.plot(0,     i, black);
            layer.plot(w - 1, i, black);
        }

        w = this.width;
        h = this.height;

        for (let y=1;y<=h;y++) {
            for (let x=1;x<=w;x++) {
                let pattern = pat1;
                if (((x - 1) % 32 < 16 && (y - 1) % 32 < 16) || ((x - 1) % 32 >= 16 && (y - 1) % 32 >= 16)) {
                    pattern = pat2;
                }

                layer.plot(x, y, pattern);
            }
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