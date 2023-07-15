function createEvent() {
    const control = document.getElementById("on-control");
    const scanline = document.querySelector(".scanline");
    const light = document.querySelector(".status-light");
    const switchElement = document.getElementById("switch");

    if (light.classList.contains("led-red")) {
        light.classList.remove("led-red");
        light.classList.add("led-green");

        control.querySelector("span").innerText = "OFF";

        switchElement.checked = true;

        scanline.style.display = "initial";
    } else {
        light.classList.remove("led-green");
        light.classList.add("led-red");

        control.querySelector("span").innerText = "ON";

        switchElement.checked = false;

        scanline.style.display = "none";
    }
}

function buttonChange() {
    document.getElementById("switch").addEventListener("change", createEvent);
    document.getElementById("on-control").addEventListener("click", createEvent);
}

export { buttonChange };
