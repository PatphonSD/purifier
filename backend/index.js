const httpServer = require("./utils/httpServer");
const http = require("http");
const io = require("./utils/io")(httpServer);
const createLogger = require("./helpers/createLogger");
const createMqttClient = require("./helpers/createMqttClient");
const configureSocketIo = require("./helpers/configureSocketIo");
const { serve } = require("micro");
const cache = require("./utils/cache");
const cors = require("micro-cors")({
  origin : "*"
});

const micro = new http.Server(
  cors(
    serve(async (req, res) => {
      const result = cache.get();
      console.log(result)
      return result
    })
  )
);

// Logging Configuration
const logger = createLogger();

// MQTT Client Configuration
const mqttClient = createMqttClient(logger);

// Socket.IO Handling
configureSocketIo(io, mqttClient, logger);

// Start the Server
httpServer.listen(3250, () => {
  logger.info("Server listening on port 3250");
});

micro.listen(3002);
