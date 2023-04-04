require("dotenv").config();
const express = require("express");

const router = express.Router();
const resUtil = require("./resConvertUtil.js");
const nftService = require("../services/nft-service");

router.post("/admin-create-token", async (req, res, next) => {
  const dto = req.body;

  nftService
    .admin_createToken(dto)
    .then((data) => {
      console.log(data);
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/admin-burn-token", async (req, res, next) => {
  const dto = req.body;

  nftService
    .admin_burnToken(dto)
    .then((data) => {
      console.log(data);
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/admin-mint-token", async (req, res, next) => {
  const dto = req.body;

  nftService
    .admin_mintToken(dto)
    .then((data) => {
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      // res.json(resUtil.convertRes(err.message, "오류가 발생하였습니다."));
      next(err);
    });
});

router.post("/user-create-token", async (req, res, next) => {
  const dto = req.body;

  nftService
    .user_createToken(dto)
    .then((data) => {
      console.log(data);
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/user-burn-token", async (req, res, next) => {
  const dto = req.body;

  nftService
    .user_burnToken(dto)
    .then((data) => {
      console.log(data);
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/user-mint-token", async (req, res, next) => {
  const dto = req.body;

  nftService
    .user_mintToken(dto)
    .then((data) => {
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
