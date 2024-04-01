const mqtt = require("mqtt");

// *** Helper Functions ***
function createMqttClient(logger) {
  const client = mqtt.connect({
    host: "emqx1",
    username: "purifier",
    password: "tas5630a",
    protocol: "mqtt",
  });

  client.subscribe("data");
  client.subscribe("state");

  client.on("connect", () => logger.info("MQTT client connected"));
  client.on("error", (error) => logger.error("MQTT client error:", error));

  return client;
}

module.exports = createMqttClient;
