import Tool from './Tool';
import App from '../App';
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

        if (event.deltaY > 0) {
            this.app.sprite.zoomOut();
        } else {
            this.app.sprite.zoomIn();
        }

        this.app.render();
    }

    private onMiddleMouse(event: MouseEvent, status: number) {
        if (status == 0) {
            this.dragAnchor = null;
            return;
        }

        if (this.outOfBounds(event.clientX, event.clientY)) { return; }

        let x = event.clientX - this.app.renderer.canvasX, 
            y = event.clientY - this.app.renderer.canvasY;
            
        if (this.dragAnchor == null) {
            this.dragAnchor = vec2(x, y);
            console.log(this.dragAnchor);
        }
    }
}

export default InputTool;