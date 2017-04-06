import Renderer from './engine/Renderer';
import Sprite from './engine/Sprite';
import { Input } from './engine/Input';
import { $ } from './engine/Utils';

class App {
    private renderer        :       Renderer;
    private sprite          :       Sprite;

    constructor() {
        this.renderer = new Renderer(854, 480, document.getElementById("divApp"));
        this.sprite = new Sprite(64, 64, this.renderer);

        this.initEvents();
        
        this.render();
    }

    private initEvents(): void {
        Input.onMouseWheel((event: WheelEvent) => {
            if (event.deltaY > 0) {
                this.sprite.zoomOut();
            } else {
                this.sprite.zoomIn();
            }

            var per = this.sprite.zoom * 100 + "%";
            $("#lblZoom").innerHTML = per;

            this.render();
        })
    }

    private render(): void {
        this.renderer.clear();
        this.sprite.render();
    }
}

window.onload = function() {
    new App();
};