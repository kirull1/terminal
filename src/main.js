import { commandLinePage } from "./scripts/pages.js";
import MainWindow from "./scripts/window.js";
import { windowResize, preloadAnimation } from "./utils/app.js";
import { buttonChange } from "./effect/button.js";
import fullscreen from "./effect/fullscreen.js";
import {mobileCheck, showMobileError} from "./scripts/mobileError.js";

import "./styles/main.css";
import "./styles/crt.css";
import "./styles/scanline.css";

const mainWindowDocument = document.querySelector("main");

function init() {
    const mainWindow = new MainWindow(mainWindowDocument);
    mainWindow.createWindow();
    // enterPage(mainWindow);
    // enterPage(mainWindow);
    commandLinePage(mainWindow);
}

if(mobileCheck()) {
    showMobileError();
    throw new Error("Sorry, this application cannot be used from a mobile device.");
}

init();
windowResize();
preloadAnimation();
buttonChange();
fullscreen();
