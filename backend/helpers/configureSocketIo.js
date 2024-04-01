const cache = require("../utils/cache");
const stateMap = ["on", "off", "auto"];
function configureSocketIo(io, mqttClient, logger) {
  io.on("connection", (socket) => {
    logger.info("Socket.io client connected");

    socket.on("state", (state) => {
      if (stateMap.includes(state)) {
        mqttClient.publish("state", state, (error) => {
          cache.set(state);
          if (error) {
            logger.error("Failed to publish state:", error);
          } else {
            logger.info("State published to MQTT : " + state);
          }
        });
      }
    });

    socket.on("disconnect", () => logger.info("Socket.io client disconnected"));
  });

  mqttClient.on("message", (topic, message) => {
    if (topic === "data") {
      try {
        const data = JSON.parse(message.toString());
        logger.info(data);
        io.emit("data", data);
      } catch (error) {
        logger.error("Error parsing MQTT message:", error);
      }
    }
  });
}

module.exports = configureSocketIo;
