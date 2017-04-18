import Tool from './Tool';
import App from '../App';
import { Input } from '../engine/Input';
import { col, bresenhamLine } from '../engine/Utils';
import { Vector2 } from '../engine/Vector2';

class BrushTool extends Tool {
    private isPainting          :       boolean;
    private lastPixel           :       Vector2;

    constructor(app: App) {
        super(app, 'B');

        this.name = "Brush";
        this.iconPosition = [0, 0];
        this.isPainting = false;
        this.lastPixel = null;

        this.addIcon();
    }

    private plot(x: number, y: number): void {
        let mx = Math.floor((x - this.app.renderer.canvasX) - this.app.renderer.canvasWidth / 2),
            my = Math.floor(this.app.renderer.canvasHeight / 2 - (y - this.app.renderer.canvasY)),
            pixel = this.app.sprite.screenCoordsToLocalPixels(mx, my);

        if (!pixel) { 
            this.lastPixel = null;
            return; 
        }

        if (this.lastPixel != null) {
            let line = bresenhamLine(this.lastPixel, pixel);
            for (let i=0,pix:Vector2;pix=line[i];i++) {
                this.app.sprite.layer.plot(pix.x, pix.y, col(0, 0, 0, 255));
            }
        } else {
            this.app.sprite.layer.plot(pixel.x, pixel.y, col(0, 0, 0, 255));
        }
        
        this.app.render();

        this.lastPixel = pixel;
    }

    public activate(): void {
        super.activate();

        this.registeredEvents.push(Input.onMouseLeft((event: MouseEvent, status: number) => {
            if (status != 1 || this.app.renderer.outOfBounds(event.clientX, event.clientY)) { 
                this.isPainting = false;
                this.lastPixel = null;

                return; 
            }
            
            this.plot(event.clientX, event.clientY);
            this.isPainting = true;
        }));

        this.registeredEvents.push(Input.onMouseMove((event: MouseEvent) => {
            if (this.app.renderer.outOfBounds(event.clientX, event.clientY)) { 
                this.isPainting = false;

                return; 
            }

            if (this.isPainting) {
                this.plot(event.clientX, event.clientY);
            }
        }));
    }
}

export default BrushTool;