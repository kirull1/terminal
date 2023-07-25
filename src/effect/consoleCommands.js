import { isFunction } from "../utils/common";

class ConsoleCommands {
    
    constructor() {
        this.currDir = "/";
        this.commands = {};
    }

    setCommand(command, target) {
        if (command === undefined || command.length === 0) {
            throw new Error("Command cannot be empty!");
        }

        if (target === undefined || (target.length === 0 && !isFunction(target))) {
            throw new Error("Target command cannot be empty!");
        }

        if (Object.prototype.hasOwnProperty.call(this.commands, command)) {
            throw new Error("This command is already defined!");
        }

        this.commands[command.toLowerCase()] = target;

        return true;
    }

    setCommands(commands = []) {
        if (commands.length === 0) {
            throw new Error("Array of commands cannot be empty!");
        }

        for (let i = 0; i < commands.length; i++) {
            this.setCommand(...commands[i]);
        }

        return true;
    }

    runCommand(command, context = null) {
        if (command === undefined || command.length === 0) {
            return "command cannot be empty";
        }

        const splitCommand = command.split(" ");
        const firstWord = splitCommand[0].toLowerCase();

        if (Object.prototype.hasOwnProperty.call(this.commands, firstWord)) {

            const currCommand = this.commands[firstWord];

            if (typeof currCommand === "string") {
                return currCommand;
            }

            if (isFunction(currCommand)) {
                return currCommand.apply({command: splitCommand, context: context, target: this});
            }

        }

        return `"${firstWord}" is not internal or external command.`;
    }

}

export default ConsoleCommands;
