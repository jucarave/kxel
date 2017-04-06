interface eventCallback {
    (event: Event): void;
};

class Input {
    private wheelCallbacks: Array<eventCallback>;

    constructor() {
        this.wheelCallbacks = [];

        this.defineEvents();
    }

    private defineEvents() {
        document.addEventListener("mousewheel", (event: Event) => {
            for (let i=0,mc:eventCallback;mc=this.wheelCallbacks[i];i++) {
                mc(<WheelEvent> event);
            }
        });
    }

    public onMouseWheel(callback: eventCallback) {
        this.wheelCallbacks.push(callback);
    }
}

let inputExport = new Input();

export { inputExport as Input };