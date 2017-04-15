import Tool from './Tool';
import App from '../App';
import { Input } from '../engine/Input';
import { Vector2, vec2 } from '../engine/Vector2';
import Matrix4 from '../engine/Matrix4';

class HandTool extends Tool {
    private dragAnchor: Vector2;

    constructor(app: App) {
        super(app, 'H');

        this.name = "Hand";
        this.iconPosition = [32, 0];
        this.dragAnchor = null;

        this.addIcon();
    }

    public activate(): void {
        super.activate();

        this.dragAnchor = null;
        
        this.registeredEvents.push(Input.onMouseLeft((event: MouseEvent, status: number) => {
            this.eventHandler(event, status);
        }));

        this.registeredEvents.push(Input.onMouseRight((event: MouseEvent, status: number) => {
            this.eventHandler(event, status);
        }));

        this.registeredEvents.push(Input.onMouseMove((event: MouseEvent, status: number) => {
            if (this.app.renderer.outOfBounds(event.clientX, event.clientY)) {
                this.dragAnchor = null;
            }
            if (this.dragAnchor == null) { return; }

                    console.log("dragging");

            this.eventHandler(event, status);
        }));
    }

    public deactivate(): void {
        super.deactivate();

        this.dragAnchor = null;
    }

    private eventHandler(event: MouseEvent, status: number): void {
        if (this.app.renderer.outOfBounds(event.clientX, event.clientY) || status != 1) {
            this.dragAnchor = null;
            return;
        }

        let x = event.clientX - this.app.renderer.canvasX,
            y = event.clientY - this.app.renderer.canvasY;
        
        this.drag(x, y);
    }

    public drag(x: number, y: number): void {
        if (this.dragAnchor == null) {
            this.dragAnchor = vec2(x, y);
        }

        let dx = x - this.dragAnchor.x,
            dy = this.dragAnchor.y - y;

        this.dragAnchor = vec2(x, y);

        Matrix4.translate(this.app.sprite.position, dx, dy, 0, true);

        this.app.render();
    }
}

export default HandTool;