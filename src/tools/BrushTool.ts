import Tool from './Tool';
import App from '../App';
import { Input } from '../engine/Input';
import { col } from '../engine/Utils';

class BrushTool extends Tool {
    private isPainting          :       boolean;

    constructor(app: App) {
        super(app, 'B');

        this.name = "Brush";
        this.iconPosition = [0, 0];
        this.isPainting = false;

        this.addIcon();
    }

    private plot(x: number, y: number): void {
        let mx = Math.floor((x - this.app.renderer.canvasX) - this.app.renderer.canvasWidth / 2),
            my = Math.floor(this.app.renderer.canvasHeight / 2 - (y - this.app.renderer.canvasY)),
            pixel = this.app.sprite.screenCoordsToLocalPixels(mx, my);

        if (!pixel) { return; }

        this.app.sprite.layer.plot(pixel.x, pixel.y, col(0, 0, 0, 255));
        this.app.render();
    }

    public activate(): void {
        super.activate();

        this.registeredEvents.push(Input.onMouseLeft((event: MouseEvent, status: number) => {
            if (status != 1 || this.app.renderer.outOfBounds(event.clientX, event.clientY)) { 
                this.isPainting = false;

                return; 
            }
            
            this.plot(event.clientX, event.clientY);
            this.isPainting = true;
        }));

        this.registeredEvents.push(Input.onMouseMove((event: MouseEvent) => {
            if (this.isPainting) {
                this.plot(event.clientX, event.clientY);
            }
        }));
    }
}

export default BrushTool;