import { generateUUID } from './Utils';

interface Callback {
    (event: Event, status: number): void;
}

interface EventCallback {
    callback: Callback,
    uuid: string
};

interface ListenerMap {
    [index: string] : "wheelCallbacks" | "middleMouseCallbacks" | "moveMouseCallbacks" | "leftMouseCallbacks" | "rightMouseCallbacks"
}

class Input {
    private wheelCallbacks          :       Array<EventCallback>;
    private middleMouseCallbacks    :       Array<EventCallback>;
    private leftMouseCallbacks      :       Array<EventCallback>;
    private rightMouseCallbacks     :       Array<EventCallback>;
    private moveMouseCallbacks      :       Array<EventCallback>;

    private callbacksMap            :       ListenerMap;

    constructor() {
        this.wheelCallbacks = [];
        this.middleMouseCallbacks = [];
        this.leftMouseCallbacks = [];
        this.rightMouseCallbacks = [];
        this.moveMouseCallbacks = [];
        
        this.callbacksMap = {};

        this.defineEvents();
    }

    private defineEvents(): void {
        document.addEventListener("mousewheel", (event: WheelEvent) => {
            this.callEventCallbacks(this.wheelCallbacks, event, 1);
        });

        document.addEventListener("mousedown", (event: MouseEvent) => {
            this.dispatchButtonEvent(event, 1);
        });

        document.addEventListener("mouseup", (event: MouseEvent) => {
            this.dispatchButtonEvent(event, 0);
        });

        document.addEventListener("mousemove", (event: MouseEvent) => {
            this.callEventCallbacks(this.moveMouseCallbacks, event, 1);
        });
    }

    private dispatchButtonEvent(event: MouseEvent, status: number): void {
        let buttons = event.buttons,
            middle = buttons & 4,
            left = buttons & 1, 
            right = buttons & 2;

        event.cancelBubble = true;
        event.stopPropagation();
        event.preventDefault();

        if (left || event.button == 0) { this.callEventCallbacks(this.leftMouseCallbacks, event, status); }

        if (middle || event.button == 1) { this.callEventCallbacks(this.middleMouseCallbacks, event, status); }

        if (right || event.button == 2) { this.callEventCallbacks(this.rightMouseCallbacks, event, status); }
    }

    private callEventCallbacks(list: Array<EventCallback>, event: Event, status: number) {
        for (let i=0,rm:EventCallback;rm=list[i];i++) {
            rm.callback(event, status);
        }
    }

    public onMouseWheel(callback: Callback): string {
        let uuid = generateUUID();
        
        this.wheelCallbacks.push({ callback: callback, uuid: uuid});
        this.callbacksMap[uuid] = "wheelCallbacks";

        return uuid;
    }

    public onMouseLeft(callback: Callback): string {
        let uuid = generateUUID();
        
        this.leftMouseCallbacks.push({ callback: callback, uuid: uuid});
        this.callbacksMap[uuid] = "leftMouseCallbacks";

        return uuid;
    }

    public onMouseRight(callback: Callback): string {
        let uuid = generateUUID();
        
        this.rightMouseCallbacks.push({ callback: callback, uuid: uuid});
        this.callbacksMap[uuid] = "rightMouseCallbacks";

        return uuid;
    }

    public onMiddleMouse(callback: Callback): string {
        let uuid = generateUUID();
        
        this.middleMouseCallbacks.push({ callback: callback, uuid: uuid});
        this.callbacksMap[uuid] = "middleMouseCallbacks";

        return uuid;
    }

    public onMouseMove(callback: Callback): string {
        let uuid = generateUUID();
        
        this.moveMouseCallbacks.push({ callback: callback, uuid: uuid});
        this.callbacksMap[uuid] = "moveMouseCallbacks";

        return uuid;
    }

    public removeListener(uuid: string): void {
        let callback = this.callbacksMap[uuid];

        if (!callback){ return; }

        let map = this[callback];
        for (let i=0;i<map.length;i++) {
            if (map[i].uuid == uuid) {
                map.splice(i, 1);
                return;
            }
        }

        throw new Error("UUID [" + uuid + "] not found");
    }
}

let inputExport = new Input();

export { inputExport as Input };