import { removeHTML, replaceCharacter } from "./utils.js";

class Content {

    constructor(windowSetting) {
        this.windowContent = windowSetting.window;
        this.maxWidthChar = windowSetting.maxWidthChar;
        this.maxHeightChar = windowSetting.maxHeightChar;

        this.defaultSymbol = windowSetting.backgroundChar;
        this.splitSymbol = windowSetting.splitSymbol;

        this.lastId = 0;
        this.elementList = [];
    }

    #addElementList(action = {}) {
        this.elementList.push(action);
    }

    #getNewId() {
        return this.lastId++;
    }

    #putindex(string, posX, posY) {
        this.windowContent[posX] = replaceCharacter(this.windowContent[posX], posY, string, 1);
    }

    #parseContent(object) {
        if (object["content"] === undefined) {
            throw new Error("Property \"content\" is not specified! The property is required");
        }

        let id = this.#getNewId();

        let yPointer = 0;
        let xPointer = 0;

        let contentValue = object["content"];
        let contentSize = contentValue.length;

        let type = object["type"] || "text";
        let onclick = object["onclick"];
        let options = {};

        if (object.hasOwnProperty("inputSize") && type === "input") {
            contentSize += Number(object["inputSize"]);
        }

        for (const key in object) {
            switch (key) {
                case "top":
                    yPointer = Number(object[key]);
                    break;

                case "left":
                    xPointer = Number(object[key]);
                    break;

                case "center":
                    if (Boolean(object[key]) === false) break;
                    xPointer = Math.floor((this.maxWidthChar - contentSize) / 2);
                    break;

                case "content":
                    break;

                case "inputSize":
                    break;

                case "inputValue":
                    break;

                case "type":
                    break;

                case "onclick":
                    break;

                default:
                    console.error(`Undefined Property "${key}"`);
                    break;
            }
        }

        switch (type) {
            case "text":
                break;

            case "input":
                let size = 1;
                let inputValue = "";

                contentValue = `<span id="interactive" data-content-id="${id}">` + contentValue;

                if (object.hasOwnProperty("inputSize")) {
                    size = object["inputSize"];
                }

                if (object.hasOwnProperty("inputValue")) {
                    inputValue = object["inputValue"];
                }

                contentValue += `<span id="input-element">${inputValue.padEnd(size, "_")}</span>`;
                contentValue += "</span>";

                options = { inputSize: size, inputText: inputValue };

                break;

            case "button":
                contentValue = `<span id="button" data-content-id="${id}">` + contentValue + "</span>";
                break;

            default:
                console.error(`Undefined type "${type}"`);
                break;
        }

        this.#addElementList({
            id: id,
            content: contentValue,
            x: xPointer,
            y: yPointer,
            type: type,
            onclick: onclick,
            options: options
        });

        this.#putindex("*" + String(id), yPointer, xPointer);
    }

    #putContent() {
        for (let i = 0; i < this.windowContent.length; i++) {
            let elStart = 0;
            let elEnd = 0;
            for (let j = 0; j < this.windowContent[i].length; j++) {
                if (this.windowContent[i][j] === "*") {
                    elStart = j + 1;
                    continue;
                }

                if (elStart != 0) {
                    if (/^\d+$/.test(this.windowContent[i][j])) {
                        elEnd = j;
                    } else {
                        let elId = Number(this.windowContent[i].substring(elStart, elEnd + 1));
                        let len = removeHTML(this.elementList[elId].content).length + 1;
                        this.windowContent[i] = replaceCharacter(this.windowContent[i], elStart - 1, this.elementList[elId].content, len);
                        this.elementList[elId].x = elStart - 1;

                        elStart = 0;
                        elEnd = 0;
                    }
                }
            }
        }
    }

    #putCenterString(string, symbol, length) {
        let stringLength = string.length;
        return symbol.repeat(Math.ceil((length - stringLength) / 2)) + string + symbol.repeat(Math.floor((length - stringLength) / 2));
    }

    drawContent(content) {
        for (let i = 0; i < content.length; i++) {
            this.#parseContent(content[i]);
        }

        this.#putContent();

        return this.windowContent;
    }

    createDocumentElement(name, className = "", styles = {}, parent = "body") {
        let stringStyles = "";

        if (Object.keys(styles).length !== 0 && styles.constructor === Object) {
            for (let style in styles) {
                stringStyles += String(style) + ":" + String(styles[style]) + ";";
            }
        }

        const div = document.createElement("div");

        div.id = name;
        div.style = stringStyles;
        div.className = className;

        document.querySelector(parent).appendChild(div);
    }

    appendToElement(name, string = "") {
        const element = document.getElementById(name);

        element.append(string);
    }

    setToElement(name, string = "") {
        document.getElementById(name).innerHTML = string;
    }

    createTable(tableSetting) {
        let workline = "";
        let hrline = "";

        let headerline = [];
        let contentline = [];

        let id = 0;

        const tableData = [];

        workline += "|";
        hrline += "|";

        tableSetting.content.forEach(elGroup => {
            elGroup.forEach((el, index) => {
                if (tableData[index] === undefined) {
                    tableData[index] = { lineLength: String(el).length };
                    return;
                }
                tableData[index].lineLength = Math.max(tableData[index].lineLength, String(el).length);
            });
        });

        tableSetting.column.forEach((el, index) => {
            let maxLength = Math.max(tableData[index].lineLength, el.length);
            let putString = "";

            tableData[index].lineLength = maxLength;

            if (tableSetting.center === true) {
                putString = this.#putCenterString(el, this.defaultSymbol, maxLength);
            } else {
                putString = el.padStart(maxLength, this.defaultSymbol);
            }

            workline += this.defaultSymbol + putString + this.defaultSymbol + "|";
            hrline += "-".repeat(maxLength + 2) + "|";
        });

        headerline.push(hrline, workline, hrline);

        tableSetting.content.forEach(elGroup => {
            workline = "|";

            elGroup.forEach((el, index) => {
                let maxLength = tableData[index].lineLength;
                let putString = "";

                if (tableSetting.center === true) {
                    putString = this.#putCenterString(el, this.defaultSymbol, maxLength);
                } else {
                    putString = el.padStart(maxLength, this.defaultSymbol);
                }

                workline += this.defaultSymbol + putString + this.defaultSymbol + "|";
            });

            contentline.push(`<span id="button" data-content-id=${++id}>` + workline + "</span>");

            this.#addElementList({
                id: id,
                type: "tableElement",
                options: {}
            });
        });

        const tableStyles = { width: headerline[0].length * 8 + "px", height: contentline.length * 16 + "px" };

        let windowHeight = (tableSetting.maxHeight + 1) * 16;

        tableStyles["max-height"] = windowHeight + "px";

        this.createDocumentElement("table", "defaultWindow", tableStyles);
        this.setToElement("table", headerline.join(this.splitSymbol) + this.splitSymbol);

        const contentStyles = { "max-height": (tableSetting.maxHeight - headerline.length) * 16 + "px" };

        this.createDocumentElement("tableContent", "tableWindow", contentStyles, "#table");
        this.setToElement("tableContent", contentline.join(this.splitSymbol));

        this.appendToElement("table", hrline);
    }

    drawHeader(headerData) {
        let titleString = headerData.title + " | " + headerData.page;
        let authorString = headerData.author + " | " + headerData.version;

        this.windowContent[2] = replaceCharacter(this.windowContent[2], 2, titleString, titleString.length);
        this.windowContent[2] = replaceCharacter(this.windowContent[2], this.maxWidthChar - removeHTML(authorString).length - 2, authorString, removeHTML(authorString).length);

        this.windowContent[4] = this.windowContent[0];
    }

    drawFooter(footerData) {
        let endId = this.maxHeightChar - 1;
        let titleString = footerData.message;

        this.windowContent[endId - 2] = replaceCharacter(this.windowContent[endId - 2], 2, titleString, titleString.length);

        this.windowContent[endId - 4] = this.windowContent[endId];
    }

    showError() {
        const errorDocument = document.getElementById("error");
        errorDocument.style.display = "";
    }

    hiddenError() {
        const errorDocument = document.getElementById("error");
        errorDocument.style.display = "none";
    }

    errorMessage(message, errorTime = 1000) {
        const errorTitle = "ERROR";

        const errorSize = message.length + 6;

        let line1 = "|" + "-".repeat(errorSize) + "|";
        let line2 = "|" + this.defaultSymbol.repeat(errorSize) + "|";

        let returnString = "";

        returnString += replaceCharacter(line1, Math.floor((line1.length - errorTitle.length) / 2), errorTitle, errorTitle.length);
        returnString += this.splitSymbol + line2 + this.splitSymbol + line2 + this.splitSymbol;
        returnString += replaceCharacter(line2, Math.floor((line2.length - message.length) / 2), message, message.length);
        returnString += this.splitSymbol + line2 + this.splitSymbol + line2 + this.splitSymbol + line1;

        const errorDocument = document.getElementById("error");
        errorDocument.innerHTML = returnString;

        this.showError();

        setTimeout(() => {
            this.hiddenError();
        }, errorTime);
    }

}

export default Content;
