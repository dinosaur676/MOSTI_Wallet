const errMsgObj = require("./errMsg.json");

class CustomError extends Error {
  constructor(...args) {
    super(...args);
    this.code = args[0].code || "9999";
    this.name = errMsgObj[this.code] || "internal server error";
    if (args[0].requireParam) {
      this.name = this.name.replace("%s", args[0].requireParam);
    }
    this.stack = `${this.message}\n${new Error().stack}`;
  }
}

module.exports = { CustomError };
