import App from '../App';
import { Input } from '../engine/Input';

abstract class Tool {
    protected app                         :           App;
    protected registeredEvents            :           Array<string>;
    public shortcut                       :           number;
    public name                           :           string;

    constructor(app: App, shortcut?: string) {
        this.app = app;
        this.shortcut = (shortcut)? (shortcut).charCodeAt(0) : null;
        this.name = "";
        this.registeredEvents = [];
    }

    public activate() { }

    public deactivate() {
        for (let i=0,uuid:string;uuid=this.registeredEvents[i];i++) {
            Input.removeListener(uuid);
        }

        this.registeredEvents = [];
    }
}

export default Tool;