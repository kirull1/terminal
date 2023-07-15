import { isMobile } from "../utils/mobile";

function showMobileError() {
    const body = document.querySelector("body");

    body.classList.add("mobile");
    body.innerHTML = "Sorry, this application cannot be used from a mobile device.";
}

function mobileCheck() {
    return isMobile();
}

export {mobileCheck, showMobileError};
