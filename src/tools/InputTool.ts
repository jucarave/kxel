import Tool from './Tool';
import App from '../App';
import Matrix4 from '../engine/Matrix4';
import { Vector2, vec2 } from '../engine/Vector2';
import { Input } from '../engine/Input';

class InputTool extends Tool {
    private dragAnchor      :       Vector2;

    constructor(app: App) {
        super(app);

        this.dragAnchor = null;

        this.initEvents();
    }

    private initEvents(): void {
        Input.onMouseWheel((event: WheelEvent) => {
            this.onMouseWheel(event);
        });

        Input.onMiddleMouse((event: MouseEvent, status: number) => {
            this.onMiddleMouse(event, status);
        });

        Input.onMouseMove((event: MouseEvent) => {
            this.onMouseMove(event);
        });
    }

    private outOfBounds(x: number, y: number): boolean {
        let px = x - this.app.renderer.canvasX,
            py = y - this.app.renderer.canvasY,
            width = this.app.renderer.canvasWidth,
            height = this.app.renderer.canvasHeight;

        return (px < 0 || py < 0 || px >= width || py >= height);
    }

    private onMouseWheel(event: WheelEvent): void {
        if (this.outOfBounds(event.clientX, event.clientY)) { return; }

        let sprite = this.app.sprite,
            x = (event.clientX - this.app.renderer.canvasX - (this.app.renderer.canvasWidth / 2)), 
            y = -(event.clientY - this.app.renderer.canvasY - (this.app.renderer.canvasHeight / 2)),
            nextZoom = sprite.nextZoom,
            prevZoom = sprite.prevZoom;

        if (event.deltaY > 0) {
            if (prevZoom === undefined) { return; }

            let dzoom = sprite.zoom - prevZoom, 
                dx = (x - sprite.position[12]) / (sprite.zoom / dzoom),
                dy = -(sprite.position[13] - y) / (sprite.zoom / dzoom);

            sprite.zoomOut();

            Matrix4.translate(sprite.position, Math.round(dx), Math.round(dy), 0, true);
        } else {
            if (nextZoom === undefined) { return; }

            let dzoom = nextZoom - sprite.zoom,
                dx = -(x - sprite.position[12]) / (sprite.zoom / dzoom),
                dy = (sprite.position[13] - y) / (sprite.zoom / dzoom);

            sprite.zoomIn();

            Matrix4.translate(sprite.position, Math.round(dx), Math.round(dy), 0, true);
        }

        this.app.render();
    }

    private onMiddleMouse(event: MouseEvent, status: number): void {
        if (status == 0) {
            this.dragAnchor = null;
            return;
        }

        if (this.outOfBounds(event.clientX, event.clientY)) { return; }

        let x = event.clientX - this.app.renderer.canvasX, 
            y = event.clientY - this.app.renderer.canvasY;
            
        if (this.dragAnchor == null) {
            this.dragAnchor = vec2(x, y);
        }
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.dragAnchor == null) { return; }
        if (this.outOfBounds(event.clientX, event.clientY)) { return; }

        let x = event.clientX - this.app.renderer.canvasX, 
            y = event.clientY - this.app.renderer.canvasY, 
            dx = x - this.dragAnchor.x,
            dy = this.dragAnchor.y - y;

        if (dx == 0 && dy == 0) { return; }

        this.dragAnchor = vec2(x, y);

        Matrix4.translate(this.app.sprite.position, dx, dy, 0, true);

        this.app.render();
    }
}

export default InputTool;