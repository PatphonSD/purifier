// *** Helper Functions ***
const winston = require("winston");
function createLogger() {
    return winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
      transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: "log/app.log" }),
      ],
    });
  }

  module.exports = createLogger