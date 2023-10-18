const net = require("net");
const os = require('os');
const port = 5000;
//const host = os.networkInterfaces()['IPv4'][0].address;
const server = new net.createServer();
let socketCount = 0;
let sockets = [];

const ipList = [];
const interfaces = os.networkInterfaces();
for (let iface in interfaces) {
    for(let i in interfaces[iface] ) {
        const f = interfaces[iface][i];
        if (f.family === "IPv4") {
            ipList.push(f.address);
        }
    }
}

server.on('connection', (sock) => {
    console.log("Client connected");

    sockets.push(sock); 
   

    sock.on("data", (data) => {
        const strData = data.toString();
        console.log(`Received: ${strData}`);

        const command = strData.split(" ");

        switch (command[0]) {
            case "help":
                sock.write("here is a list of commands to help\n\n" + "myip: for showing your ip address\n\n"+ "myport: for showing your port number\n\n" + "connect <destination> <port no> for establishing a new connection with specified <destination> at port <port no>.\n\n" + "terminate <connection_id> \n\n");
                break;
            case "myip":
                sock.write("your ip is: " + ipList[0]);
                //console.log(list[0]);
                break;
            case "myport":
                sock.write("\tyour port is: " + sock.remotePort);
                break;
            case "connect":
                break;
            case "list":
                listConnections(sock);
                break;
            case "terminate":
                terminateConnection(command[1]);
                break;
            case "send":
                sendMessage(sock, command[1], createMessage(command.slice(2)));
                break;
            case "exit":
                closeConnection(sock);
                break;
            default: console.log("not a right command");
            
        }

        //sock.write(result);
    });

    sock.on("end", () => {
        console.log("Client disconnected");
       
    });

    sock.on("error", (error) => {
        console.log(`Socket Error: ${error.message}`);
    });
});

server.on("error", (error) => {
    console.log(`Server Error: ${error.message}`);
});

server.listen(port, () => {
    console.log(`TCP socket server is running on host:  port: ${port}`);
});

// make it so it finds the right IP address from the list array
//may have to make sockets array and object with sockets + ip list to get index 0 of list for socket
const listConnections = (sock) => {

    sock.write("id:     IP Address       Port No");
    for (let i = 0; i < sockets.length; i++) {
        sock.write(
            `${i}:     ${ipList[0]}       ${sockets[i].remotePort}\n`
        );
    }
    
    sock.write('\n');
};


const createMessage = (arr) => {
    let str = '';

    for (let i = 0; i < arr.length; i++) {
        str += `${arr[i]} `;
    }

    return str;
}

const sendMessage = (sock, id, message) => {
    if (id >= 0 && id < sockets.length) {
        const destinationSocket = sockets[id];

        if (sock != destinationSocket) {
            destinationSocket.write(`message received from ${ipList[0]}`);
            destinationSocket.write(`Sender's Port: ${sock.remotePort}\n`);
            destinationSocket.write(`Message: "${message}"`);
            sock.write('Message sent! \n\n')
        } else {
            sock.write('Cannot send message to self\n\n');
        }
    } else {
        sock.write(`${id} is not a valid connection id\n\n`);
    }
    //console.log(message);
};

const terminateConnection = (sockIndex) => {
    if (sockIndex >= 0 && sockIndex < sockets.length) {
        closeConnection(sockets[sockIndex]);
    } else {
        sock.write(`${sockIndex} is not a valid index\n\n`);
    }
};

const closeConnection = (sock) => {
    sock.write('Closing connection\n');
    sock.destroy();
};