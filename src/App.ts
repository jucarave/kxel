import Toolshed from './Toolshed';
import Renderer from './engine/Renderer';
import Sprite from './engine/Sprite';
import InputTool from './tools/InputTool';
import ZoomTool from './tools/ZoomTool';
import Tool from './tools/Tool';
import { $ } from './engine/Utils';
import Menu from './ui/Menu';

class App {
    public readonly renderer        :       Renderer;
    public readonly toolshed        :       Toolshed;
    public sprite                   :       Sprite;
    public tool                     :       Tool;

    constructor() {
        let container = $("#divApp")[0];

        this.renderer = new Renderer(854, 480, container);
        this.toolshed = new Toolshed();

        this.initTools();
        this.initUI();
    }

    private initTools(): void {
        let zoomTool = new ZoomTool(this);
        this.toolshed.AddTool("zoom", zoomTool);

        new InputTool(this);

        this.tool = zoomTool;
        this.tool.activate();
    }

    private initUI(): void {
        new Menu();
    }

    private updateUI(): void {
        /*$("#lblZoom").innerHTML = this.sprite.zoom * 100 + "%";
        $("#lblTool").innerHTML = this.tool.name;*/
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