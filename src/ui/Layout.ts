import { $ } from '../engine/Utils';

class Layout {
    public static resize(): void {
        let size = window.innerHeight - $("#header")[0].offsetHeight;
        $("#mainBody")[0].style.height = size + "px";
    }
}

window.addEventListener("resize", () => {
    Layout.resize();
});

export default Layout;