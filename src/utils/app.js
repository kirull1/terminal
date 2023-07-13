function windowResize() {
    const element = document.querySelector(".pc-background");
    const defaultY = window.screen.availHeight + 300;

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const scale = entry.contentRect.height / defaultY;
            element.style.transform = `matrix(${scale}, 0, 0, ${scale}, 1, 1)`;
        }
    });
    observer.observe(document.querySelector("body"));
}

function preloadAnimation() {
    setTimeout(() => {
        document.querySelector(".app").classList.remove("preload");
    }, 500);
}

export { windowResize, preloadAnimation };
