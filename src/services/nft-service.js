const logger = require("../config/logger");
const nftContract = require("../web3/nftContract");
const { CustomError } = require("../error/CustomError");

const nftService = {
  createAccount: async () => {
    const account = await nftContract.createAccount();
    return account;
  },
  getTransactionInfo: async (transactionHash) => {
    const { transferData, hexTransactionData, blockDateTime } =
      await nftContract.getTransactionInfo(transactionHash);

    return {
      blockHash: hexTransactionData.blockHash,
      blockNumber: hexTransactionData.blockNumber,
      txId: hexTransactionData.transactionHash,
      from: transferData.from,
      to: transferData.to,
      tokenId: transferData.tokenId,
      blockDateTime,
    };
  },
  getNFTTransferInfo: async (tokenId) => {
    return await nftContract.getNFTTransferInfo(tokenId);
  },
  mintNFT: async (mintNFTDTO) => {
    const data = await nftContract.mintNFT(
      mintNFTDTO.address,
      JSON.stringify(mintNFTDTO.metaData)
    );
    return {
      tokenId: data.events.Transfer.returnValues.tokenId,
      txId: data.transactionHash,
    };
  },
  mintNFTV2: async (mintNFTDTO) => {
    const data = await nftContract.mintNFT(
      mintNFTDTO.address,
      JSON.stringify({
        image: mintNFTDTO.image,
      })
    );
    return {
      tokenId: data.events.Transfer.returnValues.tokenId,
      txId: data.transactionHash,
    };
  },
  getNFTBalance: async (userAddress) => {
    return await nftContract.getNFTBalance(userAddress);
  },
  getNFT: async (tokenId) => {
    const data = await nftContract
      .getNFT(tokenId)
      .catch((err) => console.log(err));
    return JSON.parse(data);
  },
  transferNft: async (nftTransferDTO) => {
    const ownerPrivateKey = nftTransferDTO.ownerPrivateKey.startsWith("0x")
      ? nftTransferDTO.ownerPrivateKey.substring(2)
      : nftTransferDTO.ownerPrivateKey;
    return await nftContract
      .transferNft(
        ownerPrivateKey,
        nftTransferDTO.ownerAddress,
        nftTransferDTO.buyAddress,
        nftTransferDTO.tokenId
      )
      .then((data) => {
        return {
          txId: data.transactionHash,
          tokenId: data.events.Transfer.returnValues.tokenId,
        };
      })
      .catch((err) => {
        logger.error(err);
        return Promise.reject(new CustomError({ code: 9999 }));
      });
  },
};

module.exports = nftService;
