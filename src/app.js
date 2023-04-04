const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerSpec = YAML.load(path.join(__dirname, "../build/swagger.yaml"));

const winston = require("./config/logger");

const indexRouter = require("./routes/index");
const accountsRouter = require("./routes/accounts");
const nftsRouter = require("./routes/nfts");
const errMsgObj = require("./error/errMsg.json");
// const { listenForMessagesMintNFT } = require("./mq/receive");
const { CustomError } = require("./error/CustomError");

const app = express();
const page = express();
const router = express.Router();

// view engine setup
page.set("views", path.join(__dirname, "views"));
page.set("view engine", "ejs");
page.use(
  "/assets",
  express.static(path.join(__dirname.replace("src", ""), "node_modules"))
);

app.use("/", page);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", router);
router.use("/", indexRouter);
router.use("/accounts", accountsRouter);
router.use("/sbts", nftsRouter);

// listenForMessagesMintNFT("ERC721");

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  const error = err instanceof CustomError ? err : new CustomError("9999");

  winston.error("error handler", error.name);

  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  const errorJson = { statusCode: error.code, message: error.name };
  res.json(errorJson);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.json(createError(404));
});

/* app.get("/page", (req, res) => {
  const resMineType = req.accepts(["json", "html"]);

  if (resMineType === "html") {
    res.render("home", {
      nickname: req.user.nickname,
    });
  }
}); */

module.exports = app;
