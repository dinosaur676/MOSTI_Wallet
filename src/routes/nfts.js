require("dotenv").config();
const express = require("express");

const router = express.Router();
const resUtil = require("./resConvertUtil.js");
const nftService = require("../services/nft-service");
const nftValidate = require("./validate/nft-validate");

const { TEST_ADDRESS, TEST_PRAIVATE_KEY, ADMIN_ADDRESS } = process.env;
const nftContract = require("../web3/nftContract");

router.get("/txId/:txId", async (req, res, next) => {
  nftService
    .getTransactionInfo(req.params.txId)
    .then((data) => {
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:tokenId/history", async (req, res, next) => {
  nftService
    .getNFTTransferInfo(req.params.tokenId)
    .then((data) => {
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/mint-nft", async (req, res, next) => {
  const mintNFTDTO = req.body;
  await nftValidate.mintNFT(mintNFTDTO).catch((err) => next(err));
  nftService
    .mintNFT(mintNFTDTO)
    .then(async (data) => {
      res.json(resUtil.convertRes(data, "민팅이 완료되었습니다."));
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:userAddress/balance", async (req, res, next) => {
  nftService
    .getNFTBalance(req.params.userAddress)
    .then((data) => {
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:tokenId/meta-data", async (req, res, next) => {
  nftService
    .getNFT(req.params.tokenId)
    .then((data) => {
      res.json(resUtil.convertRes(data));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/transfer", async (req, res, next) => {
  const nftTransferDTO = req.body;
  nftService
    .transferNft(nftTransferDTO)
    .then((data) => {
      console.log(data);
      res.json(resUtil.convertRes(data, "구매가 완료되었습니다."));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/mint-nftv2", async (req, res, next) => {
  nftService
    .mintNFTV2({
      address: TEST_ADDRESS,
      image: "http://www.emblock.co.kr/assets/img/logo/logo_emblock_w.png",
    })
    .then(async (data) => {
      res.json(resUtil.convertRes(data, "민팅이 완료되었습니다."));
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/mint-nftv3", async (req, res, next) => {
  nftService
    .mintNFTV3({
      address: TEST_ADDRESS,
      privateKey: TEST_PRAIVATE_KEY,
      toAddress: ADMIN_ADDRESS,
    })
    .then(async (data) => {
      res.json(resUtil.convertRes(data, "민팅이 완료되었습니다."));
    })
    .catch((err) => {
      next(err);
    });
});

/* router.get("/:tokenId/approve", async (req, res, next) => {
  console.log(req.params.tokenId);

  await nftContract
    .approve(TEST_PRAIVATE_KEY, TEST_ADDRESS, req.params.tokenId)
    .then((data) => {
      logger.debug("balance %s", data);
      res.json(data);
    })
    .catch((err) => {
      logger.error(err);
      next(new Error("9999"));
    });
});

router.get("/:tokenId/get-approved", async (req, res, next) => {
  console.log(req.params.tokenId);

  await nftContract
    .getApproved(req.params.tokenId)
    .then((data) => {
      logger.debug("balance %s", data);
      res.json(data);
    })
    .catch((err) => {
      logger.error(err);
      next(new Error("9999"));
    });
});

router.get("/:tokenId/ownerOf", async (req, res, next) => {
  console.log(req.params.tokenId);

  await nftContract
    .getOwnerOf(req.params.tokenId)
    .then((data) => {
      logger.debug("balance %s", data);
      res.json(data);
    })
    .catch((err) => {
      logger.error(err);
      next(new Error("9999"));
    });
});
*/
router.get("/hexToAscii", async (req, res, next) => {
  const string =
    "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002e4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6572206e6f7220617070726f766564000000000000000000000000000000000000";
  res.json({ string: await nftContract.hexToAscii(string) });
});

module.exports = router;
