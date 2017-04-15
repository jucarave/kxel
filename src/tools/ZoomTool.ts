import Tool from './Tool';
import App from '../App';
import { Input } from '../engine/Input';
import Matrix4 from '../engine/Matrix4';

class ZoomTool extends Tool {
    constructor(app: App) {
        super(app, 'Z');

        this.name = "Zoom";
        this.iconPosition = [0, 0];

        this.addIcon();
    }

    public activate(): void {
        super.activate();
        
        this.registeredEvents.push(Input.onMouseLeft((event: MouseEvent, status: number) => {
            if (this.app.renderer.outOfBounds(event.clientX, event.clientY)){ return; }
            if (status != 1) { return; }

            let x = event.clientX - this.app.renderer.canvasX,
                y = event.clientY - this.app.renderer.canvasY;
            
            this.zoomToPixel(x, y, true);
        }));

        this.registeredEvents.push(Input.onMouseRight((event: MouseEvent, status: number) => {
            if (this.app.renderer.outOfBounds(event.clientX, event.clientY)){ return; }
            if (status != 1) { return; }

            let x = event.clientX - this.app.renderer.canvasX,
                y = event.clientY - this.app.renderer.canvasY;
            
            this.zoomToPixel(x, y, false);
        }));
    }

    public zoomToPixel(px: number, py: number, zoomIn: boolean = true): void {
        let sprite = this.app.sprite,
            x = (px - (this.app.renderer.canvasWidth / 2)), 
            y = -(py - (this.app.renderer.canvasHeight / 2)),
            nextZoom = sprite.nextZoom,
            prevZoom = sprite.prevZoom;

        if (zoomIn) {
            if (nextZoom === undefined) { return; }

            let dzoom = nextZoom - sprite.zoom,
                dx = -(x - sprite.position[12]) / (sprite.zoom / dzoom),
                dy = (sprite.position[13] - y) / (sprite.zoom / dzoom);

            sprite.zoomIn();

            Matrix4.translate(sprite.position, Math.round(dx), Math.round(dy), 0, true);
        } else {
            if (prevZoom === undefined) { return; }

            let dzoom = sprite.zoom - prevZoom, 
                dx = (x - sprite.position[12]) / (sprite.zoom / dzoom),
                dy = -(sprite.position[13] - y) / (sprite.zoom / dzoom);

            sprite.zoomOut();

            Matrix4.translate(sprite.position, Math.round(dx), Math.round(dy), 0, true);
        }

        this.app.render();
    }
}

export default ZoomTool;