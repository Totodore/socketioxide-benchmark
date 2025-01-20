# Memory usage of websockets vs. socketio connections

Implements the echo servers from [fastwebsockets](https://github.com/denoland/fastwebsockets) and [socketioxide](https://github.com/Totodore/socketioxide) to benchmark the memory usage per connection.

All measures were eyeballed from the system monitor-tab, so they are not very precise.

Tests were performed with [k6](https://k6.io/), run using:

- `k6 run ./k6-faswebsockets.js`
- `k6 run ./k6-socketioxide.js`

## WebSockets

| Active connections | Memory usage |
|--------------------|--------------|
| 0                  | 3 MiB        |
| 2,500              | 25 MiB       |
| 5,000              | 48,5 MiB     |
| 25,000             | 225 MiB      |
| 35,000             | 298 MiB      |
| 45,000             | 299 MiB      |
| 50,000             | 299,6 MiB    |

At ~60,000 I run out of available sockets.

## SocketIO

| Active connections | Memory usage |
|--------------------|--------------|
| 0                  | 4 MiB        |
| 2,500              | 400 MiB      |
| 5,000              | 910 MiB      |
| 10,000             | 1,9 GiB      |
| 15,000             | 2,9 GiB      |

At ~16,000 I run out of available sockets.
