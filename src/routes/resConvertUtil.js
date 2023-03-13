module.exports.convertRes = (data, message) => {
  return {
    data,
    message: message || "요청이 완료되었습니다.",
    statusCode: "0000",
  };
};
