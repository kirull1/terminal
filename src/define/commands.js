// ECHO commands
function echo() {
    const message = this.command.slice(1);
    
    if (message.length === 0) {
        return "Error! message must be specified.";
    }
    
    return message.join(" ");
}

/*
 * Further arrays with the definition of commands.
 * Sample: [command, command_function]
 */

const echo_command = ["echo", echo];

// Result array of commands:
const arrayOfCommands = [
    echo_command
];

export default arrayOfCommands;
