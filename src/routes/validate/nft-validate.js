const { CustomError } = require("../../error/CustomError");

const nftValidate = {
  mintToken: async (mintNFTDTO) => {
    if (!mintNFTDTO.address) {
      return Promise.reject(
        new CustomError({ code: 9001, requireParam: "address" })
      );
    }
    if (!mintNFTDTO.metaData) {
      return Promise.reject(
        new CustomError({ code: 9001, requireParam: "metaData" })
      );
    }
    return Promise.resolve(true);
  },
};

module.exports = nftValidate;
