import ws from 'k6/ws';
import { check } from 'k6';

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

export default function () {
    const url = 'ws://127.0.0.1:3000/';
    const params = {
        data: { placementId: 1 },
        headers: {
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        }
    };

    let receivedEcho = false;
    const res = ws.connect(url, params, function (socket) {
        socket.on('open', () => socket.send("Hello"));
        socket.on('message', (data) => {
            if (data === "Hello") {
                receivedEcho = true;
            }
        });
        socket.on('close', () => console.log('disconnected'));
    });

    check(receivedEcho, { 'received echo': (r) => !!r });
    check(res, { 'status is 101': (r) => r && r.status === 101 });
}