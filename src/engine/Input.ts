interface eventCallback {
    (event: Event, status: number): void;
};

class Input {
    private wheelCallbacks          :       Array<eventCallback>;
    private middleMouseCallbacks    :       Array<eventCallback>;

    constructor() {
        this.wheelCallbacks = [];
        this.middleMouseCallbacks = [];

        this.defineEvents();
    }

    private defineEvents(): void {
        document.addEventListener("mousewheel", (event: WheelEvent) => {
            for (let i=0,mc:eventCallback;mc=this.wheelCallbacks[i];i++) {
                mc(event, 1);
            }
        });

        document.addEventListener("mousedown", (event: MouseEvent) => {
            this.dispatchButtonEvent(event, 1);
        });

        document.addEventListener("mouseup", (event: MouseEvent) => {
            this.dispatchButtonEvent(event, 0);
        });
    }

    private dispatchButtonEvent(event: MouseEvent, status: number): void {
        let buttons = event.buttons,
            middle = buttons & 4;

        event.cancelBubble = true;
        event.stopPropagation();
        event.preventDefault();

        if (middle || event.button == 1) for (let i=0,mm:eventCallback;mm=this.middleMouseCallbacks[i];i++) {
            mm(<MouseEvent> event, status);
        }
    }

    public onMouseWheel(callback: eventCallback) {
        this.wheelCallbacks.push(callback);
    }

    public onMiddleMouse(callback: eventCallback) {
        this.middleMouseCallbacks.push(callback);
    }
}

let inputExport = new Input();

export { inputExport as Input };