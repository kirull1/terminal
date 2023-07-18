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
        this.inputElement = {};
    }

    #clearContent(content) {
        const currContent = content.slice(this.offsetContent);
        const contentArray = [];

        for (let i = 0; i < currContent.length; i++) {
            if (currContent[i].length > this.maxWidthChar) {
                for (let j = 0; j < currContent[i].length; j += this.maxWidthChar - this.offsetLeft - 2 - this.offsetRight) {
                    contentArray.push(currContent[i].slice(j, j + this.maxWidthChar - this.offsetLeft - 2 - this.offsetRight));
                }
            } else {
                contentArray.push(currContent[i]);
            }
        }

        return contentArray;
    }

    #setContent(contentOffset = 0) {
        if (this.inputElement === undefined) {
            throw new Error("Input must be specified.");
        }
        
        const contentArray = this.#clearContent(this.history);

        const prepareContent = [];

        let index = 0;

        // maximum number of lines (minus 1 for input)
        const maxIndex = Math.min(contentArray.length, this.maxHeight - 1);
        
        const showContent = contentArray.slice(maxIndex * -1);
        
        for (; index < maxIndex; index++) {
            let setContent = showContent[index];

            if (this.trimmedContent === true) {
                setContent = setContent.trim();
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

    start() {
        clearWindow(this.windowContent, this.defaultSymbol);
    }

    sendEvent() {
        const eventHistory = this.history;
        const runCommand = this.runCommand;
        const eventSetContent = this.#setContent.bind(this);

        return function () {
            const value = this.options.inputText;
            this.clearInput.apply(this.target);
            eventHistory.push(runCommand(value));
            eventSetContent(1);
        };
    }

    init(content, inputElement) {
        this.history.push(...content);
        this.inputElement = inputElement;
        return this.#setContent(1);
    }

}

export default CommandLine;
