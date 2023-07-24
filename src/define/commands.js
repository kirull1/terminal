/* eslint-disable */

import { replaceTemplate } from "../utils/common";

// ECHO commands
function echo() {
    const message = this.command.slice(1);
    
    if (message.length === 0) {
        return "Error! message must be specified.";
    }
    
    return message.join(" ");
}

// COWSAY commands
function cowsay() {
    const message = this.command.slice(1);

    if (message.length === 0) {
        return "cowsay: Could not find message!";
    }

    const userMessage = message.join(" ");

    const eyesList = {
        0: "oo"
    };

    let eyes = 0;

    let resultMessage = `
 ${"_".repeat(userMessage.length + 2)}
{{C|60}} {{message}} {{C|62}}
 ${"~".repeat(userMessage.length + 2)}
        \\   ^__^
         \\  ({{eyes}})\\_______
            (__)\\       )\\/\\ 
                ||----w |
                ||     ||`;

    resultMessage = replaceTemplate(resultMessage, "{{message}}", userMessage);
    resultMessage = replaceTemplate(resultMessage, "{{eyes}}", eyesList[eyes]);

    return resultMessage;
}

/*
 * Further arrays with the definition of commands.
 * Sample: [command, command_function]
 */

const echo_command = ["echo", echo];
const cowsay_command = ["cowsay", cowsay];

// Result array of commands:
const arrayOfCommands = [
    echo_command,
    cowsay_command
];

export default arrayOfCommands;
