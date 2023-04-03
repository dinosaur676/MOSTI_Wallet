require("dotenv").config();
const Web3 = require("web3");
const Contract = require("web3-eth-contract");
const PrivateKeyProvider = require("@truffle/hdwallet-provider");
const { timestampToTimezoneDatetime } = require("../utils/time-utils");
const truffleConfig = require("../../truffle-config");
const SBTUserJson = require("../../build/contracts/SBTUser.json");
const SBTAdminJson = require("../../build/contracts/SBTAdmin.json");

const {
  ADMIN_ADDRESS,
  USER_CONTRACT_ADDRESS,
  ADMIN_CONTRACT_ADDRESS,
  TEST_NODE1,
} = process.env;

const web3 = new Web3(truffleConfig.networks.development.provider);

const SBTAdminContract = () => {
  Contract.setProvider(truffleConfig.networks.development.provider);
  return new Contract(SBTAdminJson.abi, ADMIN_CONTRACT_ADDRESS);
};

const SBTUserContract = () => {
  Contract.setProvider(truffleConfig.networks.development.provider);
  return new Contract(SBTUserJson.abi, USER_CONTRACT_ADDRESS);
};

module.exports.admin_Mint = async (tokenOwner, to, tokenId) => {
  const SBTContract = SBTAdminContract();

  return await SBTContract.methods
    .mintSBT(tokenOwner, to, tokenId)
    .send({ from: ADMIN_ADDRESS })
    .then((data) => {
      return Promise.resolve(data);
    })
    .catch((err) => Promise.reject(err));
};

module.exports.admin_Burn = async (tokenOwner, to, tokenId) => {
  const SBTContract = SBTAdminContract();

  return await SBTContract.methods
    .burnSBT(tokenOwner, to, tokenId)
    .send({ from: ADMIN_ADDRESS })
    .then((data) => {
      return Promise.resolve(data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports.admin_createToken = async (tokenOwner) => {
  const SBTContract = SBTAdminContract();

  return await SBTContract.methods
    .createToken(tokenOwner)
    .send({ from: ADMIN_ADDRESS })
    .then((data) => {
      return Promise.resolve(data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports.user_Mint = async (tokenOwner, to, tokenId) => {
  const SBTContract = SBTUserContract();

  return await SBTContract.methods
    .mintSBT(tokenOwner, to, tokenId)
    .send({ from: ADMIN_ADDRESS })
    .then((data) => {
      return Promise.resolve(data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports.user_Burn = async (to, tokenId) => {
  const SBTContract = SBTUserContract();

  return await SBTContract.methods
    .burnSBT(to, tokenId)
    .send({ from: ADMIN_ADDRESS })
    .then((data) => {
      return Promise.resolve(data);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

module.exports.user_createToken = async (tokenOwner) => {
  const SBTContract = SBTUserContract();

  return await SBTContract.methods
    .createToken(tokenOwner)
    .send({ from: ADMIN_ADDRESS })
    .then((data) => {
      return Promise.resolve(data);
    })
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

module.exports.createAccount = async () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(web3.eth.accounts.create());
    } catch (err) {
      reject(err);
    }
  });
};
