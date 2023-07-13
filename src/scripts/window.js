class MainWindow {
    constructor(documentWindow) {
        this.documentWindow = documentWindow;

        this.charSizeWidth = 8;
        this.charSizeHeight = 16;

        this.windowWidth = 400 * 2;
        this.windowHeight = 320 * 2;

        this.maxWidthChar = this.windowWidth / this.charSizeWidth;
        this.maxHeightChar = this.windowHeight / this.charSizeHeight;

        this.charBorderX = "-";
        this.charBorderY = "|";
        this.charCorner = "+";
        this.backgroundChar = " ";
        this.splitSymbol = "<br />";

        this.windowContent = [];
    }

    createWindow() {
        this.windowContent = [];
    
        let lineX = "";
        let lineY = "";
    
        for (let i = 0; i < this.maxWidthChar; i++) {
    
            if (i === 0 || i === this.maxWidthChar - 1) {
                lineX += this.charCorner;
                lineY += this.charBorderY;
                continue;
            }
    
            lineX += this.charBorderX;
            lineY += this.backgroundChar;
        }
    
        this.windowContent.push(lineX);
    
        for (let i = 1; i < this.maxHeightChar - 1; i++) {
            this.windowContent.push(lineY);
        }
    
        this.windowContent.push(lineX);
    }

    drawWindow() {
        if (this.documentWindow === undefined) {
            return;
        }
    
        this.documentWindow.innerHTML = "";
    
        for (let i = 0; i < this.windowContent.length; i++) {
            this.documentWindow.innerHTML += `<span data-line="${i}">` + this.windowContent[i] + "</span>" + this.splitSymbol;
        }
    
        return true;
    }

    set window(windowContent) {
        this.windowContent = windowContent;
    }

    get setting() {
        return {
            window: this.windowContent,
            maxWidthChar: this.maxWidthChar,
            maxHeightChar: this.maxHeightChar,
            backgroundChar: this.backgroundChar,
            charSizeWidth: this.charSizeWidth,
            charSizeHeight: this.charSizeHeight,
            splitSymbol: this.splitSymbol
        };
    }
}

export default MainWindow;
