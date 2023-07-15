function goFullscreen() {
    return (() => {
        this.fullscreenElement.requestFullscreen();
    })();
}

function fullscreenchanged() {
    return (() => {
        const mainContainer = this.fullscreenElement.querySelector(".container");

        if (document.fullscreenElement) {
            this.fullscreenControlMenu.style.display = "flex";
            this.goButton.style.display = "none";
            mainContainer.classList.add("main-fullscreen");
        } else {
            this.goButton.style.display = "flex";
            this.fullscreenControlMenu.style.display = "none";
            mainContainer.classList.remove("main-fullscreen");
        }
    })();
}

function createCloseEvent() {
    this.closeButton.addEventListener("click", () => document.exitFullscreen());
}

function createOpenEvent() {
    this.goButton.addEventListener("click", goFullscreen.bind(this));
    this.fullscreenElement.addEventListener("fullscreenchange", fullscreenchanged.bind(this));
}

function fullscreen() {
    const fullscreenContext = new Object();
    fullscreenContext.fullscreenElement = document.getElementById("main-element");
    fullscreenContext.fullscreenControlMenu = document.getElementById("control");
    fullscreenContext.closeButton = document.getElementById("close-fullscreen");
    fullscreenContext.goButton = document.getElementById("go-fullscreen");

    createCloseEvent.apply(fullscreenContext);
    createOpenEvent.apply(fullscreenContext);
}

export default fullscreen;
