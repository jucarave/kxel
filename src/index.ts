import Renderer from './engine/Renderer';
import Sprite from './engine/Sprite';
import Tool from './tools/Tool';
import InputTool from './tools/InputTool';
import { $ } from './engine/Utils';

class App {
    public readonly renderer        :       Renderer;
    private tools                   :       Array<Tool>;

    public sprite                   :       Sprite;

    constructor() {
        this.renderer = new Renderer(854, 480, document.getElementById("divApp"));
        this.initTools();
    }

    private initTools(): void {
        this.tools = [];

        new InputTool(this);
    }

    private updateUI(): void {
        $("#lblZoom").innerHTML = this.sprite.zoom * 100 + "%";
    }

    public newSprite(width: number, height: number): Sprite {
        this.sprite = new Sprite(width, height, this.renderer);
        
        this.render();

        return this.sprite;
    }

    public render(): void {
        this.renderer.clear();
        this.sprite.render();

        this.updateUI();
    }
}

window.onload = function() {
    let app = new App();
    app.newSprite(64, 64);
};

export default App;