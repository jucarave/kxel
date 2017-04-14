import App from '../App';
import { Input } from '../engine/Input';
import { $ } from '../engine/Utils';

const ICONS_PER_ROW = 4;

abstract class Tool {
    private static uiIconsRow             :           HTMLDivElement;

    protected app                         :           App;
    protected registeredEvents            :           Array<string>;
    protected iconElement                 :           HTMLDivElement;
    protected iconPosition                :           Array<number>;

    public shortcut                       :           number;
    public name                           :           string;
    
    constructor(app: App, shortcut?: string) {
        this.app = app;
        this.shortcut = (shortcut)? (shortcut).charCodeAt(0) : null;
        this.name = "";
        this.registeredEvents = [];
        this.iconPosition = [0, 0];
    }

    public activate(): void {
        this.iconElement.className = "button active";
    }

    public deactivate(): void {
        this.iconElement.className = "button";

        for (let i=0,uuid:string;uuid=this.registeredEvents[i];i++) {
            Input.removeListener(uuid);
        }

        this.registeredEvents = [];
    }

    public addIcon(): void {
        let row = Tool.uiIconsRow;
        if (!row || row.childElementCount >= ICONS_PER_ROW) {
            row = document.createElement("div");
            row.className = "toolshedRow";

            Tool.uiIconsRow = row;

            $("#toolshed")[0].appendChild(row);
        }

        let shortcut = (this.shortcut)? " (" + String.fromCharCode(this.shortcut) + ")" : "";

        this.iconElement = document.createElement("div");
        this.iconElement.className = "button";
        this.iconElement.title = this.name + shortcut;
        this.iconElement.style.backgroundPositionX = (-this.iconPosition[0]) + "px";
        this.iconElement.style.backgroundPositionY = (-this.iconPosition[1]) + "px";

        row.appendChild(this.iconElement);
    }
}

export default Tool;