import { isFunction, replaceCharacter } from "../utils/common.js";

class Control {

    constructor(windowSetting, elementList, globalTask = undefined) {
        this.windowContent = windowSetting.window;

        this.tabSelectAction = { id: -1, status: false };
        this.elementList = elementList.filter((el) => el.type != "text") || [];

        this.defaultSymbol = windowSetting.backgroundChar;
        this.charHeight = windowSetting.charSizeHeight;

        this.globalTask = globalTask;

        this.selectedElement = true;
    }

    #scrollWindow(selectWindow, scrollCount, activeElement) {
        if (activeElement === undefined) {
            selectWindow.scrollTop = 0;
            return;
        }

        let windowHeight = selectWindow.offsetHeight;

        if (windowHeight === 0) {
            return;
        }

        if (activeElement.offsetTop >= windowHeight / 2) {
            selectWindow.scrollTop += scrollCount * this.charHeight;
        }
    }

    #putTab(symbol = this.defaultSymbol) {
        if (this.tabSelectAction.id < 0) return;

        if (this.selectedElement === false) {
            symbol = this.defaultSymbol;
        }
        
        let element = this.elementList[this.tabSelectAction.id];

        if (this.globalTask === "table") {

            let mainWindow = document.getElementById("tableContent");

            if (symbol === this.defaultSymbol) {
                this.#scrollWindow(mainWindow, 0);
                mainWindow.querySelectorAll("#selectElement").forEach(el => el.remove());
                return;
            }

            const selectLine = mainWindow.querySelector(`[data-content-id="${element.id}"]`);

            let selectElement = document.createElement("span");

            selectElement.innerHTML = symbol;
            selectElement.id = "selectElement";
            selectElement.style.position = "absolute";
            selectElement.style.left = 0;

            selectLine.appendChild(selectElement);

            selectElement = selectElement.cloneNode(true);

            selectElement.style.left = "unset";
            selectElement.style.right = 0;

            selectLine.appendChild(selectElement);

            this.#scrollWindow(mainWindow, element.id - 3, selectLine);

            return;
        }

        const selectLine = document.querySelector(`[data-line="${element.y}"]`);

        selectLine.innerHTML = replaceCharacter(selectLine.innerHTML, element.x - 1, symbol, 1);
    }

    #clearCurrInput() {
        this.elementList[this.tabSelectAction.id].options.inputText = "";
        return this.#putTextInput;
    }

    #putTextInput(string = "") {
        let element = this.elementList[this.tabSelectAction.id];
        const selectInput = document.querySelector(`[data-content-id="${element.id}"]`).querySelector("#input-element");
        selectInput.innerHTML = string.padEnd(element.options.inputSize, "_").replace(/ /g, this.defaultSymbol);
    }

    #nextTab() {
        const incrementId = () => {
            this.tabSelectAction.id = (this.tabSelectAction.id + 1) % this.elementList.length;
        };

        const decrementId = () => {
            if (this.tabSelectAction.id - 1 < 0) {
                this.tabSelectAction.id = this.elementList.length - 1;
                return;
            }

            this.tabSelectAction.id = (this.tabSelectAction.id - 1) % this.elementList.length;
        };

        const tabEvent = event => {
            if (event.code === "Tab" || event.code === "ArrowDown") {
                this.tabSelectAction.status = true;

                this.#putTab();

                event.preventDefault();
                incrementId();

                this.#putTab("*");
            }

            if (event.code === "ArrowUp") {
                this.#putTab();

                event.preventDefault();
                decrementId();

                this.#putTab("*");
            }

            if (event.code === "Escape") {
                this.#putTab();
                this.tabSelectAction.status = false;
                this.tabSelectAction.id = -1;
            }
        };

        return tabEvent;
    }

    #clickElement() {
        const clickEvent = event => {
            const allow = ["interactive", "button", "input-element"];
            if (!allow.includes(event.target.id)) return;

            let target = event.target;

            if (event.target.id === "input-element") {
                target = event.target.parentNode;
            }

            this.#putTab();
            this.tabSelectAction.status = true;

            let id = Number(target.getAttribute("data-content-id"));

            this.tabSelectAction.id = this.elementList.findIndex((el) => el.id === id);

            if (event.target.id === "button" && Object.prototype.hasOwnProperty.call(this.elementList[this.tabSelectAction.id], "onclick")) {
                this.elementList[this.tabSelectAction.id].onclick.call(this, this.elementList);
                return;
            }

            this.#putTab("*");
        };

        return clickEvent;
    }

    #tabActiveKeyboard() {
        const keyboardEvent = event => {
            if (!this.tabSelectAction.status) {
                return;
            }

            const currElement = this.elementList[this.tabSelectAction.id];

            if (currElement.type !== "input") {
                return;
            }

            if (isFunction(currElement.onsubmit) && event.keyCode === 13) {
                currElement.onsubmit.apply({...currElement, clearInput: this.#clearCurrInput, target: this});
            }

            const allowCharacterCode = [32, 189];
            
            if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.key >= 0 && event.key <= 9) || allowCharacterCode.includes(event.keyCode)) {
                let letter = event.key.toUpperCase();
                currElement.options.inputText = ((currElement.options.inputText || "") + letter).substring(0, currElement.options.inputSize);

                this.#putTextInput(currElement.options.inputText);
            }

            if (event.keyCode == 8) {
                currElement.options.inputText = currElement.options.inputText.slice(0, -1);
                this.#putTextInput(currElement.options.inputText);
            }
        };

        return keyboardEvent;
    }

    #tabActiveEnter() {
        const enterEvent = event => {
            if (!this.tabSelectAction.status) {
                return;
            }

            const currElement = this.elementList[this.tabSelectAction.id];

            if (currElement.type === "text") {
                return;
            }

            if (event.keyCode == 13 && currElement.onclick) {
                currElement.onclick.call(this, this.elementList);
            }
        };

        return enterEvent;
    }

    setDefaultElement(id) {
        const currId = this.elementList.findIndex(element => element.id === id);
        
        if (currId === -1) {
            throw new Error(`Failed to select item by given id. Item with id ${id} not found.`);
        }

        this.tabSelectAction.status = true;
        this.tabSelectAction.id = currId;
    }

    activateControl() {
        document.addEventListener("keydown", this.#nextTab());
        document.addEventListener("click", this.#clickElement());

        document.addEventListener("keydown", this.#tabActiveKeyboard());
        document.addEventListener("keydown", this.#tabActiveEnter());
    }
}

export default Control;
