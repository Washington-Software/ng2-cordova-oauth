"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var provider_1 = require("../provider");
var Fitbit = (function (_super) {
    __extends(Fitbit, _super);
    function Fitbit(options) {
        _super.call(this, options);
        this.APP_SCOPE_DELIMITER = ' ';
        this.authUrl = 'https://www.fitbit.com/oauth2/authorize';
        this.defaults = {
            responseType: 'code'
        };
    }
    return Fitbit;
}(provider_1.OAuthProvider));
exports.Fitbit = Fitbit;
