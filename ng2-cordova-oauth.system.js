var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("utility", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils;
    return {
        setters:[],
        execute: function() {
            exports_1("utils", utils = {
                parseQueryString: function (url) {
                    var values = url.split(/[?#]{1,2}/)[1].split('&');
                    return values.reduce(function (map, value) {
                        var _a = value.split(/=(.+)/), paramName = _a[0], paramValue = _a[1];
                        map[decodeURIComponent(paramName)] = decodeURIComponent(paramValue);
                        return map;
                    }, {});
                },
                defaults: function (target) {
                    var sources = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        sources[_i - 1] = arguments[_i];
                    }
                    sources.forEach(function (source) {
                        for (var prop in source) {
                            if (!target.hasOwnProperty(prop)) {
                                target[prop] = source[prop];
                            }
                        }
                    });
                    return target;
                }
            });
        }
    }
});
System.register("provider", ["utility"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var utility_1;
    var DEFAULTS, OAuthProvider;
    return {
        setters:[
            function (utility_1_1) {
                utility_1 = utility_1_1;
            }],
        execute: function() {
            DEFAULTS = {
                redirectUri: 'http://localhost/callback'
            };
            OAuthProvider = (function () {
                function OAuthProvider(options) {
                    if (options === void 0) { options = {}; }
                    this.APP_SCOPE_DELIMITER = ',';
                    this.authUrl = '';
                    this.defaults = {};
                    this.options = utility_1.utils.defaults(options, DEFAULTS);
                }
                Object.defineProperty(OAuthProvider.prototype, "name", {
                    get: function () {
                        return this.constructor.name || this.authUrl;
                    },
                    enumerable: true,
                    configurable: true
                });
                OAuthProvider.prototype.parseResponseInUrl = function (url) {
                    var response = utility_1.utils.parseQueryString(url);
                    if (!this.isValid(response)) {
                        var error = new Error("Problem authenticating with " + this.name);
                        Object.defineProperty(error, 'response', { value: response });
                        throw error;
                    }
                    return response;
                };
                OAuthProvider.prototype.dialogUrl = function () {
                    return this.optionsToDialogUrl(this.options);
                };
                OAuthProvider.prototype.optionsToDialogUrl = function (options) {
                    utility_1.utils.defaults(options, this.defaults);
                    var url = this.authUrl + "?client_id=" + options.clientId + "&redirect_uri=" + encodeURIComponent(options.redirectUri);
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
                OAuthProvider.prototype.serializeAppScope = function (scope) {
                    return typeof scope.join === 'function' ? scope.join(this.APP_SCOPE_DELIMITER) : scope;
                };
                OAuthProvider.prototype.isValid = function (response) {
                    return !response.error && (response.code || response['access_token']);
                };
                return OAuthProvider;
            }());
            exports_2("OAuthProvider", OAuthProvider);
        }
    }
});
/*
 * Angular 2 (ng2) Cordova Oauth
 * Created by Nic Raboy
 * http://www.nraboy.com
 */
System.register("oauth", ["utility"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var utility_2;
    var Oauth;
    return {
        setters:[
            function (utility_2_1) {
                utility_2 = utility_2_1;
            }],
        execute: function() {
            /*
             * The main driver class for connections to each of the providers.
             */
            Oauth = (function () {
                function Oauth() {
                    this.defaultWindowOptions = {};
                }
                Oauth.prototype.login = function (provider, windowOptions) {
                    if (windowOptions === void 0) { windowOptions = {}; }
                    console.warn("\n        new CordovaOauth().login(...) is deprecated and will be removed in the next release.\n        Please use new CordovaOauth().logInVia(...) instead.\n      ");
                    return this.logInVia(provider, windowOptions);
                };
                Oauth.prototype.logInVia = function (provider, windowOptions) {
                    if (windowOptions === void 0) { windowOptions = {}; }
                    var url = provider.dialogUrl();
                    return this.openDialog(url, utility_2.utils.defaults(windowOptions, this.defaultWindowOptions), {
                        resolveOnUri: provider.options.resolveOnUri || provider.options.redirectUri,
                        providerName: provider.name
                    }).then(function (event) {
                        return provider.parseResponseInUrl(event.url);
                    });
                };
                Oauth.prototype.serializeOptions = function (options) {
                    var chunks = [];
                    for (var prop in options) {
                        if (options.hasOwnProperty(prop)) {
                            chunks.push(prop + "=" + options[prop]);
                        }
                    }
                    return chunks.join(',');
                };
                Oauth.prototype.openDialog = function (url, windowParams, options) {
                    if (options === void 0) { options = {}; }
                    return Promise.reject(new Error('Not implemented'));
                };
                return Oauth;
            }());
            exports_3("Oauth", Oauth);
        }
    }
});
System.register("provider/facebook", ["provider"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var provider_1;
    var Facebook;
    return {
        setters:[
            function (provider_1_1) {
                provider_1 = provider_1_1;
            }],
        execute: function() {
            Facebook = (function (_super) {
                __extends(Facebook, _super);
                function Facebook(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://www.facebook.com/v2.0/dialog/oauth';
                    this.defaults = {
                        responseType: 'token'
                    };
                    if (!options.appScope || options.appScope.length <= 0) {
                        throw new Error("A " + this.name + " app scope must exist");
                    }
                }
                Facebook.prototype.optionsToDialogUrl = function (options) {
                    var url = _super.prototype.optionsToDialogUrl.call(this, options);
                    if (options.authType) {
                        url += "&auth_type=" + options.authType;
                    }
                    return url;
                };
                return Facebook;
            }(provider_1.OAuthProvider));
            exports_4("Facebook", Facebook);
        }
    }
});
System.register("provider/google", ["provider"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var provider_2;
    var Google;
    return {
        setters:[
            function (provider_2_1) {
                provider_2 = provider_2_1;
            }],
        execute: function() {
            Google = (function (_super) {
                __extends(Google, _super);
                function Google(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://accounts.google.com/o/oauth2/auth';
                    this.APP_SCOPE_DELIMITER = ' ';
                    this.defaults = {
                        responseType: 'token'
                    };
                    if (!options.appScope || options.appScope.length <= 0) {
                        throw new Error("A " + this.name + " app scope must exist");
                    }
                }
                Google.prototype.optionsToDialogUrl = function (options) {
                    return _super.prototype.optionsToDialogUrl.call(this, options) + '&approval_prompt=force';
                };
                return Google;
            }(provider_2.OAuthProvider));
            exports_5("Google", Google);
        }
    }
});
System.register("provider/imgur", ["provider"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var provider_3;
    var Imgur;
    return {
        setters:[
            function (provider_3_1) {
                provider_3 = provider_3_1;
            }],
        execute: function() {
            Imgur = (function (_super) {
                __extends(Imgur, _super);
                function Imgur(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://api.imgur.com/oauth2/authorize';
                    this.defaults = {
                        responseType: 'token'
                    };
                }
                return Imgur;
            }(provider_3.OAuthProvider));
            exports_6("Imgur", Imgur);
        }
    }
});
System.register("provider/instagram", ["provider"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var provider_4;
    var Instagram;
    return {
        setters:[
            function (provider_4_1) {
                provider_4 = provider_4_1;
            }],
        execute: function() {
            Instagram = (function (_super) {
                __extends(Instagram, _super);
                function Instagram(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://api.instagram.com/oauth/authorize';
                    this.APP_SCOPE_DELIMITER = '+';
                    this.defaults = {
                        responseType: 'token'
                    };
                }
                return Instagram;
            }(provider_4.OAuthProvider));
            exports_7("Instagram", Instagram);
        }
    }
});
System.register("provider/meetup", ["provider"], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var provider_5;
    var Meetup;
    return {
        setters:[
            function (provider_5_1) {
                provider_5 = provider_5_1;
            }],
        execute: function() {
            Meetup = (function (_super) {
                __extends(Meetup, _super);
                function Meetup(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://secure.meetup.com/oauth2/authorize/';
                    this.defaults = {
                        responseType: 'token'
                    };
                }
                return Meetup;
            }(provider_5.OAuthProvider));
            exports_8("Meetup", Meetup);
        }
    }
});
System.register("provider/linkedin", ["provider"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var provider_6;
    var LinkedIn;
    return {
        setters:[
            function (provider_6_1) {
                provider_6 = provider_6_1;
            }],
        execute: function() {
            LinkedIn = (function (_super) {
                __extends(LinkedIn, _super);
                function LinkedIn() {
                    _super.apply(this, arguments);
                    this.authUrl = 'https://www.linkedin.com/oauth/v2/authorization';
                    this.APP_SCOPE_DELIMITER = ' ';
                    this.defaults = {
                        responseType: 'code'
                    };
                }
                return LinkedIn;
            }(provider_6.OAuthProvider));
            exports_9("LinkedIn", LinkedIn);
        }
    }
});
// Spotify web api authorization guide and scopes
// https://developer.spotify.com/web-api/authorization-guide
// https://developer.spotify.com/web-api/using-scopes/
System.register("provider/spotify", ["provider"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var provider_7;
    var Spotify;
    return {
        setters:[
            function (provider_7_1) {
                provider_7 = provider_7_1;
            }],
        execute: function() {
            Spotify = (function (_super) {
                __extends(Spotify, _super);
                function Spotify() {
                    _super.apply(this, arguments);
                    this.authUrl = 'https://accounts.spotify.com/authorize';
                    this.APP_SCOPE_DELIMITER = ' ';
                    this.defaults = {
                        responseType: 'token'
                    };
                }
                return Spotify;
            }(provider_7.OAuthProvider));
            exports_10("Spotify", Spotify);
        }
    }
});
System.register("provider/strava", ["provider"], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var provider_8;
    var Strava;
    return {
        setters:[
            function (provider_8_1) {
                provider_8 = provider_8_1;
            }],
        execute: function() {
            Strava = (function (_super) {
                __extends(Strava, _super);
                function Strava() {
                    _super.apply(this, arguments);
                    this.authUrl = 'https://www.strava.com/oauth/authorize';
                    this.defaults = {
                        responseType: 'code'
                    };
                }
                return Strava;
            }(provider_8.OAuthProvider));
            exports_11("Strava", Strava);
        }
    }
});
System.register("provider/untappd", ["provider", "utility"], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var provider_9, utility_3;
    var Untappd;
    return {
        setters:[
            function (provider_9_1) {
                provider_9 = provider_9_1;
            },
            function (utility_3_1) {
                utility_3 = utility_3_1;
            }],
        execute: function() {
            Untappd = (function (_super) {
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
                    utility_3.utils.defaults(options, this.defaults);
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
            }(provider_9.OAuthProvider));
            exports_12("Untappd", Untappd);
        }
    }
});
System.register("provider/vk", ["provider", "utility"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var provider_10, utility_4;
    var VK;
    return {
        setters:[
            function (provider_10_1) {
                provider_10 = provider_10_1;
            },
            function (utility_4_1) {
                utility_4 = utility_4_1;
            }],
        execute: function() {
            VK = (function (_super) {
                __extends(VK, _super);
                function VK(options) {
                    if (options === void 0) { options = {}; }
                    _super.call(this, options);
                    this.authUrl = 'https://oauth.vk.com/authorize';
                    this.defaults = {
                        responseType: 'token',
                        redirectUri: 'https://oauth.vk.com/blank.html'
                    };
                    if (!options.appScope || options.appScope.length <= 0) {
                        throw new Error("A " + this.name + " app scope must exist");
                    }
                }
                VK.prototype.optionsToDialogUrl = function (options) {
                    utility_4.utils.defaults(options, this.defaults);
                    var url = _super.prototype.optionsToDialogUrl.call(this, options);
                    if (options.display) {
                        url += "&display=" + options.display;
                    }
                    if (options.v) {
                        url += "&v=" + options.v;
                    }
                    if (options.revoke) {
                        url += "&revoke=" + options.revoke;
                    }
                    return url;
                };
                return VK;
            }(provider_10.OAuthProvider));
            exports_13("VK", VK);
        }
    }
});
System.register("core", ["oauth", "provider/facebook", "provider/google", "provider/imgur", "provider/instagram", "provider/meetup", "provider/linkedin", "provider/spotify", "provider/strava", "provider/untappd", "provider/vk"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_14(exports);
    }
    return {
        setters:[
            function (oauth_1_1) {
                exportStar_1(oauth_1_1);
            },
            function (facebook_1_1) {
                exportStar_1(facebook_1_1);
            },
            function (google_1_1) {
                exportStar_1(google_1_1);
            },
            function (imgur_1_1) {
                exportStar_1(imgur_1_1);
            },
            function (instagram_1_1) {
                exportStar_1(instagram_1_1);
            },
            function (meetup_1_1) {
                exportStar_1(meetup_1_1);
            },
            function (linkedin_1_1) {
                exportStar_1(linkedin_1_1);
            },
            function (spotify_1_1) {
                exportStar_1(spotify_1_1);
            },
            function (strava_1_1) {
                exportStar_1(strava_1_1);
            },
            function (untappd_1_1) {
                exportStar_1(untappd_1_1);
            },
            function (vk_1_1) {
                exportStar_1(vk_1_1);
            }],
        execute: function() {
        }
    }
});
System.register("provider/fitbit", ["provider"], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var provider_11;
    var Fitbit;
    return {
        setters:[
            function (provider_11_1) {
                provider_11 = provider_11_1;
            }],
        execute: function() {
            Fitbit = (function (_super) {
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
            }(provider_11.OAuthProvider));
            exports_15("Fitbit", Fitbit);
        }
    }
});
System.register("provider/runkeeper", ["provider"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var provider_12;
    var Runkeeper;
    return {
        setters:[
            function (provider_12_1) {
                provider_12 = provider_12_1;
            }],
        execute: function() {
            Runkeeper = (function (_super) {
                __extends(Runkeeper, _super);
                function Runkeeper(options) {
                    _super.call(this, options);
                    this.authUrl = 'https://runkeeper.com/apps/authorize';
                    this.defaults = {
                        responseType: 'code'
                    };
                }
                return Runkeeper;
            }(provider_12.OAuthProvider));
            exports_16("Runkeeper", Runkeeper);
        }
    }
});
System.register("provider/polar", ["provider"], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var provider_13;
    var Polar;
    return {
        setters:[
            function (provider_13_1) {
                provider_13 = provider_13_1;
            }],
        execute: function() {
            Polar = (function (_super) {
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
            }(provider_13.OAuthProvider));
            exports_17("Polar", Polar);
        }
    }
});
System.register("platform/browser", ["oauth", "utility"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var oauth_2, utility_5;
    var OauthBrowser;
    return {
        setters:[
            function (oauth_2_1) {
                oauth_2 = oauth_2_1;
            },
            function (utility_5_1) {
                utility_5 = utility_5_1;
            }],
        execute: function() {
            OauthBrowser = (function (_super) {
                __extends(OauthBrowser, _super);
                function OauthBrowser() {
                    _super.apply(this, arguments);
                    this.defaultWindowOptions = {
                        width: 600,
                        location: 1,
                        toolbar: 0,
                    };
                }
                OauthBrowser.prototype.openDialog = function (url, params, options) {
                    if (options === void 0) { options = {}; }
                    var windowParams = this.addWindowRect(utility_5.utils.defaults({ title: 'Authentication' }, params));
                    var title = windowParams.title;
                    delete windowParams.title;
                    var popup = window.open(url, title, this.serializeOptions(windowParams));
                    var watchDelay = this.constructor.WATCH_POPUP_TIMEOUT;
                    return new Promise(function (resolve, reject) {
                        if (typeof popup.focus === 'function') {
                            popup.focus();
                        }
                        setInterval(function watchPopup() {
                            try {
                                if (popup.closed) {
                                    return reject(new Error("The \"" + options.providerName + "\" sign in flow was canceled"));
                                }
                                if (popup.location.href.indexOf(options.resolveOnUri) === 0) {
                                    popup.close();
                                    resolve({ url: popup.location.href });
                                }
                            }
                            catch (e) {
                            }
                            setTimeout(watchPopup, watchDelay);
                        }, watchDelay);
                    });
                };
                OauthBrowser.prototype.addWindowRect = function (params) {
                    var root = document.documentElement;
                    var screenX = typeof window.screenX !== 'undefined' ? window.screenX : window.screenLeft;
                    var screenY = typeof window.screenY !== 'undefined' ? window.screenY : window.screenTop;
                    var outerWidth = typeof window.outerWidth !== 'undefined' ? window.outerWidth : root.clientWidth;
                    var outerHeight = typeof window.outerHeight !== 'undefined' ? window.outerHeight : root.clientHeight - 22;
                    screenX = screenX < 0 ? window.screen.width + screenX : screenX;
                    params.height = Math.floor(outerHeight * 0.8);
                    params.left = Math.floor(screenX + (outerWidth - params.width) / 2);
                    params.top = Math.floor(screenY + (outerHeight - params.height) / 2.5);
                    return params;
                };
                OauthBrowser.WATCH_POPUP_TIMEOUT = 100;
                return OauthBrowser;
            }(oauth_2.Oauth));
            exports_18("OauthBrowser", OauthBrowser);
        }
    }
});
System.register("platform/cordova", ["oauth"], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var oauth_3;
    var OauthCordova;
    function ensureEnvIsValid() {
        if (!window.cordova) {
            throw new Error('Cannot authenticate via a web browser');
        }
        if (!window.cordova.InAppBrowser) {
            throw new Error('The Apache Cordova InAppBrowser plugin was not found and is required');
        }
    }
    return {
        setters:[
            function (oauth_3_1) {
                oauth_3 = oauth_3_1;
            }],
        execute: function() {
            OauthCordova = (function (_super) {
                __extends(OauthCordova, _super);
                function OauthCordova() {
                    _super.apply(this, arguments);
                    this.defaultWindowOptions = {
                        location: 'no',
                        clearsessioncache: 'yes',
                        clearcache: 'yes'
                    };
                }
                OauthCordova.prototype.openDialog = function (url, windowParams, options) {
                    if (options === void 0) { options = {}; }
                    var params = this.serializeOptions(windowParams);
                    return new Promise(function (resolve, reject) {
                        try {
                            ensureEnvIsValid();
                        }
                        catch (error) {
                            return reject(error);
                        }
                        var browserRef = window.cordova.InAppBrowser.open(url, '_blank', params);
                        var exitListener = function () { return reject(new Error("The \"" + options.providerName + "\" sign in flow was canceled")); };
                        browserRef.addEventListener('loaderror', function () {
                            browserRef.removeEventListener('exit', exitListener);
                            browserRef.close();
                            reject(new Error("Error loading login page of \"" + options.providerName + "\""));
                        });
                        browserRef.addEventListener('loadstart', function (event) {
                            if (event.url.indexOf(options.resolveOnUri) === 0) {
                                browserRef.removeEventListener('exit', exitListener);
                                browserRef.close();
                                resolve(event);
                            }
                        });
                        return browserRef.addEventListener('exit', exitListener);
                    });
                };
                return OauthCordova;
            }(oauth_3.Oauth));
            exports_19("OauthCordova", OauthCordova);
        }
    }
});
