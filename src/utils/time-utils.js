const dayjs = require("dayjs");
require("dayjs/locale/ko");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

const tz = "Asia/Seoul";
dayjs.locale("ko");
dayjs.extend(utc);
dayjs.extend(timezone);

const timestampToTimezoneDatetime = (timestamp) => {
  return dayjs.unix(timestamp).format("YYYY-MM-DDTHH:mm:ss");
};
module.exports = { timestampToTimezoneDatetime };
