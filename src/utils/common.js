function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === "[object Function]";
}

function replaceTemplate(string, template, replacement) {
    return string.replaceAll(template, replacement);
} 

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

function removeSpecial(string) {
    let resultString = string;

    resultString = replaceTemplate(resultString, "{{C|60}}", "<");
    resultString = replaceTemplate(resultString, "{{C|62}}", ">");

    return resultString;
}

function removeHTML(string) {
    let resultString = string;

    resultString = resultString.replace(/<\/?[^>]+(>|$)/g, ""); // Delete all HTML tags
    resultString = resultString.replaceAll("&lt;", "<");
    resultString = resultString.replaceAll("&gt;", ">");

    resultString = removeSpecial(resultString);

    return resultString;
}

function clearWindow(window, symbol) {
    return window.map(element => element.replace(/./g, symbol));
}

export { clearWindow, replaceCharacter, removeSpecial, removeHTML, isFunction, replaceTemplate };
