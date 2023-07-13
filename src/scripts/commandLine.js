import { clearWindow } from "./utils";

class CommandLine {

    constructor(windowSetting) {
        this.windowContent = windowSetting.window;
        this.maxWidthChar = windowSetting.maxWidthChar;
        this.maxHeightChar = windowSetting.maxHeightChar;

        this.defaultSymbol = windowSetting.backgroundChar;
        this.splitSymbol = windowSetting.splitSymbol;

        this.offsetContent = 0;

        this.offsetTop = 0;
        this.offsetLeft = 0;
        this.offsetRight = 0;

        this.trimmedContent = true;
    }

    start() {
        clearWindow(this.windowContent, this.defaultSymbol);
    }

    setContent(content) {
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

        const prepareContent = [];

        for (let i = 0; i < contentArray.length; i++) {
            let setContent = contentArray[i];

            if (this.trimmedContent === true) {
                setContent = contentArray[i].trim();
            }

            prepareContent.push({
                top: i + 1 + this.offsetTop,
                left: 1 + this.offsetLeft,
                content: `<span class="cursor-blink">${setContent}</span>`,
            });
        }

        return prepareContent;
    }

}

export default CommandLine;
