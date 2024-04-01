/**
 * 
 * @param {Server} httpServer 
 * @returns 
 */
const io = (httpServer) => require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

module.exports = io;
