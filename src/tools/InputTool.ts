import Tool from './Tool';
import ZoomTool from './ZoomTool';
import HandTool from './HandTool';
import App from '../App';
import { Vector2, vec2 } from '../engine/Vector2';
import { Input } from '../engine/Input';

class InputTool extends Tool {
    private dragAnchor      :       Vector2;
    private zoomTool        :       ZoomTool;
    private handTool        :       HandTool;

    constructor(app: App) {
        super(app);

        this.dragAnchor = null;

        this.zoomTool = app.toolshed.getTool<ZoomTool>("zoom");
        this.handTool = app.toolshed.getTool<HandTool>("hand");

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

        Input.onKeyboard((event: KeyboardEvent, status: number) => {
            this.onKeyboard(event, status);
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
        if (this.app.renderer.outOfBounds(event.clientX, event.clientY)) {
            this.dragAnchor = null;
            return; 
        }

        let x = event.clientX - this.app.renderer.canvasX, 
            y = event.clientY - this.app.renderer.canvasY;

        this.handTool.drag(x, y);
    }

    private onKeyboard(event: KeyboardEvent, status: number): void {
        if (status != 1) { return; }
        let keyCode = event.keyCode;

        for (let i=0,tool:Tool;tool=this.app.toolshed.tools[i];i++) {
            if (tool.shortcut == keyCode) {
                this.app.changeTool(tool);
                return;
            }
        }
    }
}

export default InputTool;