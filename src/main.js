import { commandLinePage, enterPage, table } from "./scripts/pages.js";
import MainWindow from "./scripts/window.js";
import { windowResize, preloadAnimation } from "./utils/app.js";
import { buttonChange } from "./effect/button.js";

import "./styles/main.css";
import "./styles/crt.css";
import "./styles/scanline.css"

const mainWindowDocument = document.querySelector("main");

function init() {
    const mainWindow = new MainWindow(mainWindowDocument);
    mainWindow.createWindow();
    // enterPage(mainWindow);
    // enterPage(mainWindow);
    commandLinePage(mainWindow);
}

init();
windowResize();
preloadAnimation();
buttonChange();
