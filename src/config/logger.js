const winston = require("winston");
require("winston-daily-rotate-file");
const util = require("util");
const path = require("path");
const { error } = require("winston");
const { errors } = require("logform");

function transform(info) {
  const args = info[Symbol.for("splat")];
  if (args) {
    info.message = util.format(info.message, ...args);
  }
  if (typeof info.message === "object") {
    try {
      const message = JSON.stringify(info.message, null, 3);
      info.message = message;
    } catch (err) {
      if (Array.isArray(info.message)) {
        info.message.forEach((item) => {
          info.message += JSON.stringify(item);
        });
      }
    }
  }
  return info;
}

function utilFormatter() {
  return { transform };
}

const logDir = path.join(__dirname, "../../logs");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "dev";
  const isDevelopment = env === "dev";
  return isDevelopment ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: " YYYY-MM-DD HH:mm:SS ||" }),
  utilFormatter(),
  winston.format.json(),
  winston.format.printf(
    ({ level, message, label, timestamp }) =>
      `${timestamp} ${label || "-"} ${level}: ${message}`
  ),
  winston.format.errors({ stack: true })
  /*  winston.format.printf(
    (info) => `${info.timestamp} [ ${info.level} ] ▶ ${info.message}`
  ) */
);

const logger = winston.createLogger({
  format,
  level: level(),
  transports: [
    new winston.transports.DailyRotateFile({
      level: "info",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.log`,
      zippedArchive: true,
      maxFiles: 30,
    }),
    new winston.transports.DailyRotateFile({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${logDir}/error`,
      filename: `%DATE%.error.log`,
      zippedArchive: true,
      maxFiles: 30,
    }),
  ],
});
// if (process.env.NODE_ENV !== "production") {
logger.add(
  new winston.transports.Console({
    handleExceptions: true,
    level: "debug",
    format: winston.format.combine(
      format,
      winston.format.colorize({ all: true })
    ),
  })
);
// }

module.exports = logger;
