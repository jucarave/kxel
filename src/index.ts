import Renderer from './engine/Renderer';
import Sprite from './engine/Sprite';

class Game {
    private renderer: Renderer;

    constructor() {
        this.renderer = new Renderer(854, 480, document.getElementById("divGame"));
        this.renderer.clear();

        let sprite = new Sprite(64, 64, this.renderer);
        sprite.render();
    }
}

window.onload = function() {
    new Game();
};