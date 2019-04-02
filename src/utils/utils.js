"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../constant/config");
var utils = {
    getApiPrefix: function () {
        console.log(config_1.config);
        return config_1.config.protocol + "://" + config_1.config.host + ":" + config_1.config.port;
    },
    parseParam: function (obj) {
        if (!obj) {
            return '';
        }
        var pair = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                pair.push(encodeURIComponent(key) + "=" + obj[key]);
            }
        }
        return pair.join('&');
    },
    isPhoneNum: function (value) {
        if (typeof value !== 'string') {
            return false;
        }
        return /^1[3|4|5|7|8]\d{9}$/.test(value);
    },
    isLegalPwd: function (value) {
        return /^[a-zA-Z\d]+$/.test(value);
    }
};
exports.default = utils;
