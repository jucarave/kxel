import App from '../index';

abstract class Tool {
    protected app: App;

    constructor(app: App) {
        this.app = app;
    }

    public update(): void {};
}

export default Tool;