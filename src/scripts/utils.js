function replaceCharacter(string, index, replacement, replacementLength) {
    if (replacementLength === undefined) {
        replacementLength = replacement.length;
    }

    return (
        string.slice(0, index) +
      replacement +
      string.slice(index + replacementLength)
    );
}

function removeHTML(string) {
    return string.replace(/<\/?[^>]+(>|$)/g, "");
}

function clearWindow(window, symbol) {
    return window.map(element => element.replace(/./g, symbol));
}

export {clearWindow, replaceCharacter, removeHTML};
