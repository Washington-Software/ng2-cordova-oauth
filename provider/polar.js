"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var provider_1 = require("../provider");
var Polar = (function (_super) {
    __extends(Polar, _super);
    function Polar(options) {
        _super.call(this, options);
        this.authUrl = 'https://flow.polar.com/oauth2/authorization';
        this.defaults = {
            responseType: 'code',
            excludeRedirectUri: true
        };
    }
    return Polar;
}(provider_1.OAuthProvider));
exports.Polar = Polar;
