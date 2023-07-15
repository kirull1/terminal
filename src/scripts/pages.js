import CommandLine from "./commandLine.js";
import Content from "./content.js";
import Control from "./control.js";

const headerData = {
    title: "BANK",
    page: "ENTER PAGE",
    author: "AUTHOR <a href=\"https://kirull.ru\">KIRULL</a>",
    version: "VERSION 1.0"
};

const footerData = {
    message: "PLEASE SELECT A COMMAND | USE CLICK OR TAB"
};

// eslint-disable-next-line
function menuPage(windowMain) {

}

function table(windowMain) {
    const title = {
        top: 13,
        center: true,
        content: "TEST TABLE"
    };

    const tableColums = ["id", "name", "lastName", "date"];
    const tableContent = [
        ["1", "name", "lastname", "11.10.2023"],
        ["2", "name", "lastname", "11.10.2023"],
        ["3", "name", "lastname", "11.10.2023"],
        ["4", "name", "lastname", "11.10.2023"],
        ["5", "name", "lastname", "11.10.2023"],
        ["6", "name", "lastname", "11.10.2023"],
        ["7", "name", "lastname", "11.10.2023"],
        ["8", "name", "lastname", "11.10.2023"],
        ["9", "name", "lastname", "11.10.2023"],
        ["10", "name", "lastname", "11.10.2023"],
        ["11", "name", "lastname", "11.10.2023"],
        ["12", "name", "lastname", "11.10.2023"],
        ["13", "name", "lastname", "11.10.2023"],
        ["14", "name", "lastname", "11.10.2023"],
        ["15", "name", "lastname", "11.10.2023"],
        ["16", "name", "lastname", "11.10.2023"],
        ["17", "name", "lastname", "11.10.2023"],
        ["18", "name", "lastname", "11.10.2023"],
    ];

    const tableSetting = {
        title: "TABLE",
        column: tableColums,
        content: tableContent,
        center: true,
        maxHeight: 8
    };

    const contentEdit = new Content(windowMain.setting);
    contentEdit.drawContent([title]);
    contentEdit.drawHeader(headerData);
    contentEdit.drawFooter(footerData);

    contentEdit.createTable(tableSetting);

    const control = new Control(windowMain.setting, contentEdit.elementList, "table");

    control.activateControl();

    windowMain.drawWindow();
}

function enterPage(windowMain) {
    const title = {
        top: 13,
        center: true,
        content: "BANK APP"
    };

    const loginInput = {
        top: 17,
        center: true,
        content: "LOGIN: ",
        type: "input",
        inputSize: 10,
        inputValue: ""
    };

    const passwordInput = {
        top: 21,
        center: true,
        content: "PASSWORD: ",
        type: "input",
        inputSize: 11,
        inputValue: ""
    };

    const buttonClick = (elementList) => {
        console.log(elementList);
    };

    const entryButton = {
        top: 25,
        center: true,
        content: "SIGN IN",
        type: "button",
        onclick: buttonClick
    };

    const contentEdit = new Content(windowMain.setting);
    contentEdit.drawContent([title, loginInput, passwordInput, entryButton]);
    contentEdit.drawHeader(headerData);
    contentEdit.drawFooter(footerData);

    const control = new Control(windowMain.setting, contentEdit.elementList);
    control.activateControl();

    windowMain.drawWindow();
}

function commandLinePage(windowMain) {
    const contentEdit = new Content(windowMain.setting);
    const commandLine = new CommandLine(windowMain.setting);

    commandLine.offsetLeft = 1;
    commandLine.offsetRight = 1;

    let contentArray = [
        "Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! ",
        "123",
        "test"
    ];

    windowMain.drawWindow();

    const prepareContent = commandLine.setContent(contentArray);

    contentEdit.dynamicPutContent(prepareContent, 1, 10, true);

    commandLine.consoleEffect();
}

export { commandLinePage, enterPage, table };
