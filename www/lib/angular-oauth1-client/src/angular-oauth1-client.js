/*! angular-oauth1-client - v0.1.2 - 2015-07-07
* Copyright (c) 2015 Sean Fisher; Licensed MIT */

/*! angular-oauth1-client - v0.1.2 - 2015-06-24
* Copyright (c) 2015 Sean Fisher; Licensed MIT */
(function(window, angular, undefined) {'use strict';


angular.module('oauth1Client', ['LocalStorageModule'])

 .service('oauthPersistence', function(localStorageService, $q){

  var self = this;
  var OAUTH_TOKEN_KEY = "oauth_token";
  var OAUTH_TOKEN_SECRET_KEY = "oauth_token_secret";

  self.storeAccessToken = function(access_data) {
  var defer = $q.defer();
      localStorageService.set(OAUTH_TOKEN_KEY, access_data.oauth_token);
      localStorageService.set(OAUTH_TOKEN_SECRET_KEY, access_data.oauth_token_secret);

  defer.resolve();
  return defer.promise;
  }

  self.clearAccessToken = function(){
  localStorageService.remove(OAUTH_TOKEN_KEY);
  localStorageService.remove(OAUTH_TOKEN_SECRET_KEY);
  }

  self.accessIsInStorage = function(isAuthenticated, isNotAuthenticated){
  if (localStorageService.get(OAUTH_TOKEN_KEY) && localStorageService.get(OAUTH_TOKEN_SECRET_KEY)) {
  isAuthenticated();
  } else {
  isNotAuthenticated();
  }

  }
  self.getTokenAndSecret = function(onCompletion){
  onCompletion(localStorageService.get(OAUTH_TOKEN_KEY), localStorageService.get(OAUTH_TOKEN_SECRET_KEY));

  };



  })

.factory('oauth1Signer', [function oauth1SignerFactory() {
    function randomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    return {
        create: function(parameters) {
            // Adapted from https://github.com/7digital/oauth-reference-page/blob/gh-pages/oauth.js
            return _.extend({
                token: null,
                tokenSecret: "",
                version: "1.0",
                signatureMethod: "HMAC-SHA1",
                method: "GET",
                timestamp: Math.floor(Date.now() / 1000),
                nonce: randomString(32),
                callbackUrl: null,
                verifier: null,
                oauthParameters: function() {
                    var self, queryFields;
                    self = this;
                    queryFields = {
                        oauth_consumer_key: self.consumerKey,
                        oauth_nonce: self.nonce,
                        oauth_timestamp: self.timestamp,
                        oauth_signature_method: self.signatureMethod
                    };
                    if (self.token) {
                        queryFields["oauth_token"] = self.token;
                    }
                    if (self.version) {
                        queryFields["oauth_version"] = self.version;
                    }
                    if (self.callbackUrl) {
                        queryFields["oauth_callback"] = self.callbackUrl;
                    }
                    if (self.verifier) {
                        queryFields["oauth_verifier"] = self.verifier;
                    }
                    return queryFields;
                },
                queryStringFields: function() {
                    var self, queryFields, fields;
                    self = this;
                    queryFields = self.oauthParameters();
                    fields = self.fields;
                    _.each(_.keys(fields), function(field) {
                        return queryFields[field] = fields[field];
                    });
                    return queryFields;
                },
                queryString: function() {
                    var self, queryArguments, orderedFields;
                    self = this;
                    queryArguments = self.queryStringFields();
                    orderedFields = _.keys(queryArguments).sort();
                    var queryString = _.map(orderedFields, function(fieldName) {
                        return fieldName + "=" + self.percentEncode(queryArguments[fieldName]);
                    }).join("&");
                    return queryString;
                },
                urlEncoded: function(fields) {
                    return _.map(_.keys(fields), function(fieldName) {
                        return fieldName + "=" + encodeURIComponent(fields[fieldName]);
                    }).join("&");
                },
                headerEncoded: function(fields) {
                    return _.map(_.keys(fields), function(fieldName) {
                        return fieldName + '="' + encodeURIComponent(fields[fieldName]) + '"';
                    }).join(", ");
                },
                urlEncodedFields: function() {
                    var self;
                    self = this;
                    return self.urlEncoded(self.fields);
                },
                authorizationHeader: function() {
                    var self, fields;
                    self = this;
                    fields = self.oauthParameters();
                    fields["oauth_signature"] = self.base64Signature();
                    return self.headerEncoded(fields);
                },
                urlAndFields: function() {
                    var self, encodedFields;
                    self = this;
                    encodedFields = self.urlEncodedFields();
                    if (encodedFields) {
                        return self.url + "?" + encodedFields;
                    } else {
                        return self.url;
                    }
                },
                parameterEncoded: function(fields) {
                    var self = this;
                    var strToSign =
                        _.map(fields, function(field) {
                        return self.percentEncode(field);
                        }).join("&");
                    return strToSign;
                },
                baseString: function() {
                    var self;
                    self = this;
                    return self.parameterEncoded([ self.method, self.url, self.queryString() ]);
                },
                hmacKey: function() {
                    var self;
                    self = this;
                    return self.parameterEncoded([ self.consumerSecret, self.tokenSecret ]);
                },
                hmac: function(gen1_options) {
                    var encoding, self;
                    encoding = gen1_options && gen1_options.hasOwnProperty("encoding") && gen1_options.encoding !== void 0 ? gen1_options.encoding : "binary";
                    self = this;
                    if (typeof process !== "undefined") {
                        var crypto, h;
                        crypto = require("crypto");
                        h = crypto.createHmac("sha1", self.hmacKey());
                        h.update(self.baseString());
                        return h.digest(encoding);
                    } else {
                        var binaryHash;
                        binaryHash = CryptoJS.HmacSHA1(self.baseString(), self.hmacKey());
                        if (encoding === "base64") {
                            return binaryHash.toString(CryptoJS.enc.Base64);
                        } else {
                            return binaryHash;
                        }
                    }
                },
                base64Signature: function() {
                    var self;
                    self = this;
                    return self.hmac({
                        encoding: "base64"
                    });
                },
                signature: function() {
                    var self;
                    self = this;
                    return self.percentEncode(self.base64Signature());
                },
                signedUrl: function() {
                    var self;
                    self = this;
                    return self.url + "?" + self.queryString() + "&oauth_signature=" + self.signature();
                },
                curl: function() {
                    var self;
                    self = this;
                    if (self.method() === "GET") {
                        return "curl '" + self.url + "?" + self.queryString() + "&oauth_signature=" + self.signature() + "'";
                    } else if (self.method() === "POST" || self.method() === "PUT") {
                        if (self.body()) {
                            return "curl -X " + self.method() + " '" + self.urlAndFields() + "' -d '" + self.body() + "' -H 'Authorization: " + self.authorizationHeader() + "' -H 'Content-Type: " + self.bodyEncoding() + "'";
                        } else {
                            return "curl -X " + self.method() + " '" + self.url + "' -d '" + self.queryString() + "&oauth_signature=" + self.signature() + "'";
                        }
                    } else {
                        return "curl -X DELETE '" + self.url + "?" + self.queryString() + "&oauth_signature=" + self.signature() + "'";
                    }
                },
                percentEncode: function(s) {
                    return encodeURIComponent(s).replace(/\*/g, "%2A");
                }
            }, parameters);
        }
    };
}])
.provider('oauth1Client', function oauth1ClientProvider () {
    var consumerKey;
    var consumerSecret;
    var requestEndpoint;
    var authorizeEndpoint;
    var accessEndpoint;
    var oauthCallback;
//    var removeRequestEndpoint;

    this.config = function(settings) {
        consumerKey = settings.consumerKey;
        consumerSecret = settings.consumerSecret;
        requestEndpoint = settings.requestEndpoint;
        authorizeEndpoint = settings.authorizeEndpoint;
        accessEndpoint = settings.accessEndpoint;
        oauthCallback = settings.oauthCallback;
//        removeRequestEndpoint = settings.removeRequestEndpoint;
    }

    // utility functions
    function getURLParameter(url, name) {
        return decodeURIComponent((new RegExp('[?|&]?' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url)||[,""])[1].replace(/\+/g, '%20'))||null
    }

    function randomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for(var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
        };
    }

    this.$get = ['$q', '$http', 'oauth1Signer', 'oauth1Headers', 'oauth1AuthorizedHttp', 'oauthPersistence', function($q, $http, oauth1Signer, oauth1Headers, oauth1AuthorizedHttp, oauthPersistence) {

        var self = this;

        function getOAuthSigner(params) {
            return oauth1Signer.create(params);
        }

        function getRequestToken(oauthSigner, callback_url) {
            var deferred = $q.defer();
            $http.get(oauthSigner.signedUrl())
                .success(function(data, status, headers, config) {
                    deferred.resolve({
                        oauth_token: getURLParameter(data, "oauth_token"),
                        oauth_token_secret: getURLParameter(data, "oauth_token_secret"),
                        oauth_callback_confirmed: getURLParameter(data, "oauth_callback_confirmed")
                    });
                })
                .error(function(data, status, headers, config) {
                    deferred.reject("Error: " + data);
                });
            return deferred.promise;
        }

        function getAuthorizationToken(oauth_token, callback_url) {
            var deffered = $q.defer();
            var auth_window = window.open(authorizeEndpoint + "?oauth_token=" + oauth_token + "&oauth_callback=" + callback_url, '_blank', 'location=no,clearcache=yes');
            auth_window.addEventListener('loadstart', function(event) {
                if((event.url).startsWith(callback_url)) {
                    auth_window.close();

                    deffered.resolve({
                        returned_oauth_token: getURLParameter(event.url, 'oauth_token'),
                        oauth_verifier: getURLParameter(event.url, 'verifier'),
                        wp_scope: getURLParameter(event.url, 'wp_scope')
                    });
                }
            });
            return deffered.promise;
        }

        function getAccessToken(oauthSigner) {
            var deffered = $q.defer();
            $http.post(oauthSigner.signedUrl())
                .success(function(data, status, headers, config) {
                    deffered.resolve({
                        oauth_token: getURLParameter(data, "oauth_token"),
                        oauth_token_secret: getURLParameter(data, 'oauth_token_secret')
                    });
                })
                .error(function(data, status, headers, config) {
                    alert("Error: " + data);
                });
            return deffered.promise;
        }

       function checkAuthenticated(isAuthenticated, isNotAuthenticated) {

           oauthPersistence.accessIsInStorage(isAuthenticated, isNotAuthenticated);
       }

        function getAuthorizedHttpFromStorage(onCompletion) {

                 oauthPersistence.getTokenAndSecret(function(oauth_token, oauth_token_secret){
                        var signer = getOAuthSigner({
                                url : requestEndpoint,
                                consumerKey : consumerKey,
                                consumerSecret : consumerSecret,
                                token : oauth_token,
                                tokenSecret : oauth_token_secret
                                });

                        oauth1Headers.create(signer);
                        onCompletion(oauth1AuthorizedHttp.create(signer));
                });


         }

         return {
                 authorize: function(storage) {
                 var deffered = $q.defer();
                 checkAuthenticated(function(){

                        getAuthorizedHttpFromStorage(function(item) {
                                                 deffered.resolve(item);
                         });

                    }, function () {

                    var oauthSigner = getOAuthSigner({
                                                     url : requestEndpoint,
                                                     consumerKey : consumerKey,
                                                     consumerSecret : consumerSecret,
                                                     callback : oauthCallback
                                                     });
                    var authObj = oauthSigner.oauthParameters();

                    getRequestToken(oauthSigner, oauthCallback)
                        .then(function(request_data) {
                          return getAuthorizationToken(request_data.oauth_token, oauthCallback);
                          })
                        .then(function(authorization_data) {
                          oauthSigner = getOAuthSigner({
                               url : accessEndpoint,
                               consumerKey : consumerKey,
                               token : authorization_data.returned_oauth_token,
                               callback : oauthCallback,
                               verifier : authorization_data.oauth_verifier
                               });
                          return getAccessToken(oauthSigner);

                          })
                        .then(function(access_data) {
                            oauthPersistence.storeAccessToken(access_data).then(function(){
                                getAuthorizedHttpFromStorage(function(item) {deffered.resolve(item);});
                            });
                        }, function(error) {
                           deffered.resolve({error: 'error'});
                        });
                    });


             return deffered.promise;

             }

         }
    }];
})

.service('oauth1AuthorizedHttp', ['$http', '$q', function oauth1AuthorizedHttpService($http, $q) {
    return {
        create: function(signer) {
            this.oauth1Signer = signer;
            var self = this;
            return function(config) {
                self.oauth1Signer.method = config.method || "GET";
                self.oauth1Signer.url = config.url;
                $http.defaults.headers.common.Authorization = "OAuth " + self.oauth1Signer.authorizationHeader();
                $http.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
                var defer = $q.defer();
                $http(config).success(
                    function(data, status, headers, config){
                        defer.resolve(data, status, headers, config);
                    })
                .error(function(data, status, headers, config){
                        defer.reject(data, status, headers, config);
                });

                return defer.promise;
            };
        }
    }
}])

.service('oauth1Headers', function oauth1HeadersService($http) {
    return {
        create: function(signer) {
            this.oauth1Signer = signer;
            var self = this;
        },
        getHeaders: function(url, method) {
            var self = this;
            if(self.oauth1Signer){
                self.oauth1Signer.method = method;
                self.oauth1Signer.url = url;
                return {'Authorization' : "OAuth " + self.oauth1Signer.authorizationHeader(),
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                       };
            }
            else{
                return {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'};
            }
        },
        removeAuthorizationHeader: function() {
            $http.defaults.headers.common.Authorization = undefined;
        }
    }
})

;

})(window, window.angular);