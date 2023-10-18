const net = require("net");
const readline = require("readline");

const {stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({
    input,
    output,
});
rl.on("line", (input) => {
    // userInput = input;
   client.write(input);
})


const client = net.createConnection({port: process.argv[2], host: process.argv[3]}, () => {
    console.log("Connected");
    console.log("what would you like to do? type help for a list of available commands");
       
});

client.on("data", (data) => {
    console.log(`${data}`);
});

client.on("error", (error) => {
    console.log(`Error: ${error.message}`);
});

client.on("close", () => {
    console.log("Connection closed");
});