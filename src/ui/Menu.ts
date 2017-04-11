import { $ } from '../engine/Utils';

class Menu {
    private elMenu          :       HTMLUListElement;
    private menuActive      :       boolean;
    private actedOnMenu     :       boolean;

    constructor() {
        this.elMenu = <HTMLUListElement> $("#menu")[0];
        this.menuActive = false;
        this.actedOnMenu = false;

        this.createMenu();

        document.addEventListener("click", () => {
            setTimeout(() => {
                if (!this.actedOnMenu) {
                    this.menuActive = false;
                    this.hideSubmenus(0);
                }

                this.actedOnMenu = false;
            }, 5);
        });
    }

    private hideSubmenus(level: number) {
        let menus = $(".collapseSubmenu");

        for (let i=0,menu:HTMLElement;menu=menus[i];i++) {
            if (parseInt(menu.dataset.level, 10) >= level) {
                menu.style.display = "none";
            }
        }
    }

    private addElement(parent: HTMLUListElement, name: string, action?: Function, shortcut?: string): HTMLLIElement {
        let ret: HTMLLIElement = document.createElement("li");

        let label: HTMLDivElement = document.createElement("div");
        label.innerText = name;

        ret.appendChild(label);

        if (shortcut) {
            let short: HTMLDivElement = document.createElement("div");
            short.className = "shorcut";
            short.innerText = shortcut;

            ret.appendChild(short);
        }

        if (action) {
            ret.addEventListener("click", () => action());
        }
        
        parent.appendChild(ret);

        return ret;
    }

    private createSubmenu(parent: HTMLLIElement, level: number, addArrow: boolean = false): HTMLUListElement {
        let ret: HTMLUListElement = document.createElement("ul");

        if (addArrow) {
            parent.className = "submenu";
        }

        parent.appendChild(ret);

        ret.style.display = "none";
        ret.className = "collapseSubmenu"
        ret.dataset.level = level + "";

        parent.addEventListener("click", () => {
            ret.style.display = "block";
            this.actedOnMenu = true;
            this.menuActive = true;
        });

        parent.addEventListener("mouseover", (event: Event) => {
            if (!this.menuActive) { return; }

            event.stopPropagation();
            this.hideSubmenus(level);

            ret.style.display = "block";
        });

        return ret;
    }

    private createMenu(): void {
        let menu1 = this.addElement(this.elMenu, "Menu 1"),
            menu1Det = this.createSubmenu(menu1, 1),
            
            menu1_1 = this.addElement(menu1Det, "Menu 1.1"),
            menu1_1Det = this.createSubmenu(menu1_1, 2, true);

        this.addElement(menu1Det, "Menu 1.2", () => this.Menu1_2Action(), "Ctrl-N");

        this.addElement(menu1_1Det, "Menu 1.1.1");
        this.addElement(menu1_1Det, "Menu 1.1.2");

        let menu2 = this.addElement(this.elMenu, "Menu 2"),
            menu2Det = this.createSubmenu(menu2, 1);

        this.addElement(menu2Det, "Menu 2.1");
        this.addElement(menu2Det, "Menu 2.2", null, "Ctrl-F");
    }

    private Menu1_2Action() {
        console.log("Menu action 1.2");
    }
}

export default Menu;