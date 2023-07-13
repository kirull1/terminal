function buttonChange() {
    document.getElementById("switch").addEventListener("change", () => {
        const scanline = document.querySelector(".scanline");
        const light = document.querySelector(".status-light");

        if (light.classList.contains("led-red")) {
            light.classList.remove("led-red");
            light.classList.add("led-green");

            scanline.style.display = "initial";
        } else {
            light.classList.remove("led-green");
            light.classList.add("led-red");

            scanline.style.display = "none";
        }
    });
}

export { buttonChange };
