import Tool from './Tool';
import ZoomTool from './ZoomTool';
import App from '../App';
import Matrix4 from '../engine/Matrix4';
import { Vector2, vec2 } from '../engine/Vector2';
import { Input } from '../engine/Input';

class InputTool extends Tool {
    private dragAnchor      :       Vector2;
    private zoomTool        :       ZoomTool;

    constructor(app: App) {
        super(app);

        this.dragAnchor = null;
        this.zoomTool = app.toolshed.getTool<ZoomTool>("zoom");

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

    private onMouseWheel(event: WheelEvent): void {
        if (this.app.renderer.outOfBounds(event.clientX, event.clientY)) { return; }

        this.zoomTool.zoomToPixel(event.clientX - this.app.renderer.canvasX, event.clientY - this.app.renderer.canvasY, event.deltaY < 0);
    }

    private onMiddleMouse(event: MouseEvent, status: number): void {
        if (status == 0) {
            this.dragAnchor = null;
            return;
        }

        if (this.app.renderer.outOfBounds(event.clientX, event.clientY)) { return; }

        let x = event.clientX - this.app.renderer.canvasX, 
            y = event.clientY - this.app.renderer.canvasY;
            
        if (this.dragAnchor == null) {
            this.dragAnchor = vec2(x, y);
        }
    }

    private onMouseMove(event: MouseEvent): void {
        if (this.dragAnchor == null) { return; }
        if (this.app.renderer.outOfBounds(event.clientX, event.clientY)) { return; }

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