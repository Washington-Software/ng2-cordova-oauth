"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var provider_1 = require("../provider");
var Runkeeper = (function (_super) {
    __extends(Runkeeper, _super);
    function Runkeeper(options) {
        _super.call(this, options);
        this.authUrl = 'https://runkeeper.com/apps/authorize';
        this.defaults = {
            responseType: 'code'
        };
    }
    return Runkeeper;
}(provider_1.OAuthProvider));
exports.Runkeeper = Runkeeper;
