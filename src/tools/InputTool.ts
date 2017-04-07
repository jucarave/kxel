import Tool from './Tool';
import App from '../index';
import { Input } from '../engine/Input';

class InputTool extends Tool {
    constructor(app: App) {
        super(app);

        this.initEvents();
    }

    private initEvents(): void {
        Input.onMouseWheel((event: WheelEvent) => {
            this.onMouseWheel(event);
        })
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
}

export default InputTool;