import { clearWindow } from "../utils/common";

class CommandLine {

    constructor(windowSetting, contentEdit, consoleCommands) {
        this.contentEdit = contentEdit;
        this.runCommand = consoleCommands.runCommand.bind(consoleCommands);

        this.windowContent = windowSetting.window;
        this.maxWidthChar = windowSetting.maxWidthChar;
        this.maxHeightChar = windowSetting.maxHeightChar;

        this.defaultSymbol = windowSetting.backgroundChar;
        this.splitSymbol = windowSetting.splitSymbol;

        this.heightOffset = 2;

        this.maxHeight = this.maxHeightChar - this.heightOffset;
        this.offsetContent = 0;

        this.offsetTop = 0;
        this.offsetLeft = 0;
        this.offsetRight = 0;

        this.trimmedContent = true;

        this.history = [];
        this.commandHistory = [];
        this.inputElement = {};
        
        this._moveHistory = 0;
        this._moveCommandHistory = 0;
        this._currentCommand = null;
    }

    #clearContent(content) {
        const currContent = content.slice(this.offsetContent);
        const contentLines = [];

        for (let i = 0; i < currContent.length; i++) {
            if (currContent[i].includes("\n")) {
                contentLines.push(...currContent[i].split("\n"));
                continue;
            }

            contentLines.push(currContent[i]);
        }

        const contentArray = [];

        for (let i = 0; i < contentLines.length; i++) {
            if (contentLines[i].length > this.maxWidthChar) {
                for (let j = 0; j < contentLines[i].length; j += this.maxWidthChar - this.offsetLeft - 2 - this.offsetRight) {
                    contentArray.push(contentLines[i].slice(j, j + this.maxWidthChar - this.offsetLeft - 2 - this.offsetRight));
                }
            } else {
                contentArray.push(contentLines[i]);
            }
        }

        return contentArray;
    }

    #setContent(contentOffset = 1) {
        if (this.inputElement === undefined) {
            throw new Error("Input must be specified.");
        }
        
        const contentArray = this.#clearContent(this.history);

        const prepareContent = [];

        let index = 0;

        // maximum number of lines (minus 1 for input)
        const maxIndex = Math.min(contentArray.length, this.maxHeight - 1);

        let contentSlice = contentArray.length - maxIndex;

        if (contentArray.length > this.maxHeight) {
            contentSlice -= this._moveHistory;
        
            if (contentSlice < 0) {
                contentSlice = 0;
                this._moveHistory -= 1;
            }
        }

        const showContent = contentArray.slice(contentSlice);
        
        for (; index < maxIndex; index++) {
            let setContent = showContent[index];

            if (this.trimmedContent === true) {
                setContent = setContent.replace(/\s+$/, "");
            }

            prepareContent.push({
                top: index + 1 + this.offsetTop,
                left: contentOffset + this.offsetLeft,
                content: `<span>${setContent.toUpperCase()}</span>`,
            });
        }

        prepareContent.push({
            top: maxIndex + 1 + this.offsetTop,
            left: contentOffset + this.offsetLeft,
            type: "input",
            ...this.inputElement
        });
        
        this.contentEdit.dynamicPutContent(prepareContent, 1, maxIndex + this.heightOffset - 1, true);
    }

    #putValueInputLine(value) {
        const currentInput = this.controlCtx.elementList.find(element => element.type === "input" && element.id === this.inputElement.id);
        currentInput.options.inputText = value;
    }

    #movementEvent(event) {        
        if (![33, 34].includes(event.keyCode)) {
            return;
        }

        if (event.keyCode === 33) {
            this._moveHistory += 1;
        }

        if (event.keyCode === 34) {
            this._moveHistory = Math.max(this._moveHistory - 1, 0);
        }

        this.#setContent();
    }

    #movementCommandHistory(event) {         
        if (![38, 40].includes(event.keyCode)) {
            return;
        }

        const currentInput = this.controlCtx.elementList.find(element => element.type === "input" && element.id === this.inputElement.id);

        if (this._currentCommand === null) {
            this._currentCommand = currentInput.options.inputText || "";
        }

        if (event.keyCode === 38 && this._moveCommandHistory < this.commandHistory.length) {
            this._moveCommandHistory += 1;
        }

        if (event.keyCode === 40) {
            this._moveCommandHistory = Math.max(this._moveCommandHistory - 1, 0);
        }

        let currentValue = "";

        if (this._moveCommandHistory > 0) {
            currentValue = this.commandHistory[this.commandHistory.length - this._moveCommandHistory];
        } else if (this._moveCommandHistory === 0) {
            currentValue = this._currentCommand || "";
        }

        this.inputElement.inputValue = currentValue;
        this.#setContent();
        this.#putValueInputLine(currentValue);
    }

    #movement() {
        document.addEventListener("keydown", this.#movementEvent.bind(this));
        document.addEventListener("keydown", this.#movementCommandHistory.bind(this));
    }

    forceUpdate() {
        this.contentEdit.dynamicPutContent([], 1, this.maxHeight, true);
    }

    start() {
        clearWindow(this.windowContent, this.defaultSymbol);
    }

    sendEvent() {
        const eventHistory = this.history;
        const commandHistory = this.commandHistory;
        const runCommand = this.runCommand;
        
        const reset = () => {
            this._moveHistory = 0;
            this.inputElement.inputValue = "";
            this._currentCommand = null;
            this._moveCommandHistory = 0;
        };

        const eventSetContent = this.#setContent.bind(this);
        const commandLineContext = this;

        return function () {
            const value = this.options.inputText;
            this.clearInput.apply(this.target);

            if (commandHistory.includes(value)) {
                commandHistory.splice(commandHistory.indexOf(value), 1);
            }

            commandHistory.push(value);

            const commandOutput = runCommand(value, commandLineContext);

            if (commandOutput !== undefined) {
                eventHistory.push(commandOutput);
            }

            this.clearInput.call(this.target);

            reset();
            eventSetContent();
        };
    }

    setControlCtx(controlCtx) {
        this.controlCtx = controlCtx;
    }

    init(content, inputElement) {
        this.history.push(...content);
        this.inputElement = inputElement;
        this.#movement();
        return this.#setContent();
    }

}

export default CommandLine;
