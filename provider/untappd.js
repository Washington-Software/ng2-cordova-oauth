"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var provider_1 = require("../provider");
var utility_1 = require('../utility');
var Untappd = (function (_super) {
    __extends(Untappd, _super);
    function Untappd(options) {
        if (options === void 0) { options = {}; }
        _super.call(this, options);
        this.authUrl = 'https://untappd.com/oauth/authenticate/';
        this.defaults = {
            responseType: 'token'
        };
    }
    Untappd.prototype.optionsToDialogUrl = function (options) {
        utility_1.utils.defaults(options, this.defaults);
        //Had to override this method to change the OAuth spec redirect_uri to redirect_url
        var url = this.authUrl + "?client_id=" + options.clientId + "&redirect_url=" + options.redirectUri;
        if (options.appScope) {
            url += "&scope=" + this.serializeAppScope(options.appScope);
        }
        if (options.state) {
            url += "&state=" + options.state;
        }
        if (options.responseType) {
            url += "&response_type=" + options.responseType;
        }
        return url;
    };
    return Untappd;
}(provider_1.OAuthProvider));
exports.Untappd = Untappd;
