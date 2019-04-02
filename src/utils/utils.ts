const utils = {
  parseParam(obj) {
    if (!obj) {
      return '';
    }
    const pair = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        pair.push(`${encodeURIComponent(key)}=${obj[key]}`);
      }
    }
    return pair.join('&');
  },
  isPhoneNum: (value) => {
    if (typeof value !== 'string') {
      return false;
    }
    return /^1[3|4|5|7|8]\d{9}$/.test(value);
  },
  isLegalPwd: (value) => {
    return /^[a-zA-Z\d]+$/.test(value);
  }
};
export default utils;
