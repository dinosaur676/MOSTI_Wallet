require("dotenv").config();
const Web3 = require("web3");
const Contract = require("web3-eth-contract");
const PrivateKeyProvider = require("@truffle/hdwallet-provider");
const { timestampToTimezoneDatetime } = require("../utils/time-utils");
const truffleConfig = require("../../truffle-config");
const NFT = require("../../build/contracts/DGNFT.json");

const { ADMIN_ADDRESS, ERC721_CONTRACT_ADDRESS, BESU_NODE1 } = process.env;
const nftMetaData = require("./nft-metadata.json");

const web3 = new Web3(truffleConfig.networks.development.provider);

const adminContract = () => {
  Contract.setProvider(truffleConfig.networks.development.provider);
  return new Contract(NFT.abi, ERC721_CONTRACT_ADDRESS);
};
const userContract = (privateKey) => {
  const privateKeyProvider = new PrivateKeyProvider(privateKey, BESU_NODE1);
  Contract.setProvider(privateKeyProvider);
  return new Contract(NFT.abi, ERC721_CONTRACT_ADDRESS);
};

module.exports.mintNFT = async (toAddress, metaData) => {
  const mintNftContract = adminContract();
  return await mintNftContract.methods
    .mintNFT(toAddress, metaData)
    .send({ from: ADMIN_ADDRESS })
    .then((data) => {
      return Promise.resolve(data);
    })
    .catch((err) => Promise.reject(err));
};
module.exports.mintNFTWithMQ = async (param, channel, msg) => {
  const mintNftContract = adminContract();
  const toAddress = param.address;
  // if (channel && msg) await channel.ack(msg);
  return await mintNftContract.methods
    .mintNFT(toAddress, JSON.stringify({ ...nftMetaData, image: param.image }))
    .send({ from: ADMIN_ADDRESS })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports.getTransactionInfo = async (transactionHash) => {
  const hexTransactionData = await web3.eth.getTransactionReceipt(
    transactionHash
  );

  const hexTransferData =
    hexTransactionData.logs[hexTransactionData.logs.length - 1];

  const transferData = web3.eth.abi.decodeLog(
    [
      {
        type: "address",
        name: "from",
        indexed: true,
      },
      {
        type: "address",
        name: "to",
        indexed: true,
      },
      {
        type: "uint256",
        name: "tokenId",
        indexed: true,
      },
    ],
    hexTransferData.data,
    [
      hexTransferData.topics[1],
      hexTransferData.topics[2],
      hexTransferData.topics[3],
    ]
  );

  const blockInfo = await web3.eth.getBlock(hexTransactionData.blockNumber);

  return {
    transferData,
    hexTransactionData,
    blockDateTime: timestampToTimezoneDatetime(blockInfo.timestamp),
  };
};

module.exports.getNFTTransferInfo = async (tokenId) => {
  const mintNftContract = adminContract();
  return await mintNftContract.methods
    .transferInfo(tokenId)
    .call()
    .then((data) => {
      return Promise.resolve(data);
    })
    .catch((err) => Promise.reject(err));
};

module.exports.transferNft = async (
  ownerPrivateKey,
  ownerAddress,
  buyAddress,
  tokenId
) => {
  const transferNftContract = userContract(ownerPrivateKey);
  return await transferNftContract.methods
    .safeTransferFrom(ownerAddress, buyAddress, tokenId)
    .send({ from: ownerAddress })
    .then((data) => Promise.resolve(data))
    .catch((error) => {
      return Promise.reject(error);
    });
};

module.exports.getNFTBalance = async (param) => {
  const mintNftContract = adminContract();
  return await mintNftContract.methods
    .balanceOf(param.userAddress)
    .call()
    .then((data) => Promise.resolve({ balance: parseInt(data, 10) }))
    .catch((err) => Promise.reject(err));
};

module.exports.getNFT = async (tokenId) => {
  const mintNftContract = adminContract();
  return await mintNftContract.methods
    .tokenURI(tokenId)
    .call()
    .then((data) => Promise.resolve(data))
    .catch((err) => Promise.reject(err));
};

module.exports.getOwnerOf = async (tokenId) => {
  const mintNftContract = adminContract();
  const owner = await mintNftContract.methods
    .ownerOf(tokenId)
    .call()
    .then((data) => Promise.resolve(data))
    .catch((err) => Promise.reject(err));
  return { owner };
};

module.exports.createAccount = async () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(web3.eth.accounts.create());
    } catch (err) {
      reject(err);
    }
  });
};

module.exports.hexToAscii = async (string) => {
  try {
    await web3.eth
      .getPastLogs({
        fromBlock: "0x0",
        address: ERC721_CONTRACT_ADDRESS,
      })
      .then((res) => {
        // res.forEach((item) => web3.eth.abi.decodeLog(,item.topics));
      })
      .catch((err) => console.log("err", err));
  } catch (e) {
    console.log(e);
  }
  return web3.utils.hexToAscii(string);
};

/* module.exports.mintNFTV2 = async (toAddress, tokenURI) => {
  return new Promise((resolve, reject) => {
    const toAddress = "0xF62fb6300B34a59a1b81a8F36F8fb07E043ADc68";
    nftContract.methods
      .mintNFT(toAddress, { ...nftMetaData, image: param.image })
      .send({ from: ADMIN_ADDRESS })
      .on("confirmation", function (confirmationNumber, receipt) {
        if (confirmationNumber === 0) {
          web3.eth
            .getTransactionReceipt(receipt.transactionHash)
            .then((data) => {
              const tokenIds = web3.utils.hexToNumber(data.logs[0].topics[3]);
              /!* const toAddress =
                param.address || web3.eth.accounts.create().address; *!/
              nftContract.methods
                .safeTransferFrom(ADMIN_ADDRESS, toAddress, tokenIds)
                .send({ from: ADMIN_ADDRESS })
                .on(
                  "confirmation",
                  function (transferConfirmationNumber, transferReceipt) {
                    if (transferConfirmationNumber === 0) {
                      logger.debug(toAddress);
                      resolve({ ...transferReceipt, toAddress });
                    }
                  }
                )
                .on("error", function (error) {
                  reject(error);
                })
                .catch((err) => {
                  logger.error(err);
                  reject(err);
                });
            })
            .catch((err) => {
              logger.error(err);
              reject(err);
            });
        }
      })
      .on("error", function (error) {
        logger.error(error);
        reject(error);
      })
      .catch((err) => {
        logger.error(err);
        reject(err);
      });
  });
};
module.exports.getOwnerOf = async (tokenId) => {
  const mintNftContract = adminContract();
  const owner = await mintNftContract.methods
    .ownerOf(tokenId)
    .call()
    .then((data) => {
      console.log(data);
      return data;
    });
  return { owner };
};

module.exports.approve = async (
  privateKey,
  fromAddress,
  toAddress,
  tokenId
) => {
  const transferNftContract = userContract(privateKey);
  const owner = await transferNftContract.methods
    .approve(fromAddress, tokenId)
    .send({ from: fromAddress })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
  return { owner };
};

module.exports.getApproved = async (tokenId) => {
  const transferNftContract = adminContract();
  const owner = await transferNftContract.methods
    .getApproved(tokenId)
    .call()
    .then((data) => {
      console.log(data);
      return data;
    });
  return { owner };
};

*/
