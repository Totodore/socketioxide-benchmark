import ws from "k6/ws";
import http from "k6/http";
import { sleep } from "k6";

export let options = {
    stages: [
        { duration: '30s', target: 5000 },
        { duration: '30s', target: 10000 },
        { duration: '30s', target: 15000 },
        { duration: '30s', target: 20000 },
        { duration: '30s', target: 25000 },
        { duration: '30s', target: 30000 },
        { duration: '30s', target: 35000 },
        { duration: '30s', target: 40000 },
        { duration: '30s', target: 45000 },
        { duration: '30s', target: 50000 },
        { duration: '60s', target: 50000 },
        { duration: '90s', target: 0 },
    ],
};

const socketIoPath = "127.0.0.1:3000/socket.io/?EIO=4&transport=";

export default function () {
    // HTTP then Websocket upgrading
    const received = http.get(`http://${socketIoPath}polling`);
    // substring 1 to remove first char protocol number
    const { sid, upgrades, pingInterval, pingTimeout, maxPayload } = JSON.parse(received.body.substring(1));
    // Server informs websocket available
    if(upgrades.includes("websocket")) {
        // Use sid to upgrade current polling session
        ws.connect(`ws://${socketIoPath}websocket&sid=${sid}`, (socket) => {
            socket.on("open", () => {
                socket.send('2probe'); // Send ping
            });
            socket.on("message", (message) => {
                // console.log(message);

                // Receive pong from server
                if(message === "3probe") {
                    socket.send('5'); // Upgrade
                    socket.send('40'); // Ask default namespace / connection
                }
                // Namespace connected by server
                if(message.startsWith("40")) {
                    // Test sending JSON formatted message on event test
                    while (true) {
                        sleep(pingInterval);
                        socket.ping();
                    }

                    socket.send('41');  // Disconnect namespace
                    socket.close();
                }
            });
            socket.on("error", (error) => {
                console.error(error)
            })
        });
    }
}