require("dotenv").config();
const express = require("express");

const router = express.Router();
const resUtil = require("./resConvertUtil.js");
const nftService = require("../services/nft-service");
const nftValidate = require("./validate/nft-validate");

const { TEST_ADDRESS, TEST_PRAIVATE_KEY, ADMIN_ADDRESS } = process.env;
const nftContract = require("../web3/nftContract");

router.post("/admin-create-token", async (req, res, next) => {
  nftService
    .admin_createToken(req.body.tokenOwner)
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
      next(err);
    });
});

router.post("/user-create-token", async (req, res, next) => {
  nftService
    .user_createToken(req.body.tokenOwner)
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
