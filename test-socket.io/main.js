const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const server = createServer();
const io = new Server(server);
const jwt = require("jsonwebtoken");

// Define the secret key for decoding the JWT
const SECRET_KEY = "test";

// Equivalent function to validate a fake JWT token
function fakeValidateJwtToken(headerValue) {
  if (headerValue) {
    try {
      // Extract the "Bearer" token
      const authHeader = headerValue.toString();
      const bearerToken = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7) // Remove "Bearer " prefix
        : null;

      if (bearerToken) {
        // Decode the token (validation occurs here, but the result is ignored)
        jwt.verify(bearerToken, SECRET_KEY, { algorithms: ["HS512"] });
        return true;
      }
    } catch (err) {
      // For benchmarking, ignore errors and return true
      return true;
    }
  }

  // If no header or token, return false
  return false;
}

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    socket.emit("message-back", data);
  });

  console.log("a user connected");
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
