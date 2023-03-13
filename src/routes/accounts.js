require("dotenv").config();
const express = require("express");

const router = express.Router();
/* const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc"); */
const logger = require("../config/logger");
const resUtil = require("./resConvertUtil.js");
const nftService = require("../services/nft-service");

router.post("", async (req, res, next) => {
  nftService
    .createAccount()
    .then((data) => {
      res.json(resUtil.convertRes(data, "계정 생성이 완료되었습니다."));
    })
    .catch((err) => {
      logger.error(err);
      next(new Error("9002"));
    });
});

module.exports = router;
