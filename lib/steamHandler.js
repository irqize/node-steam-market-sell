let steamTotp = require('steam-totp');
let request = require('request');
let steamTradeOffers = require('steam-tradeoffers');
let steamcommunity = require('steamcommunity');

class steamHandler {
    constructor(options) {
        if (options.steamcommunity) {
            this.sessionID = options.sessionID;
            this.cookies = options.cookies;
            this.steamcommunity = options.steamcommunity;

            this.jar = request.jar();

            let self = this;
            options.cookies.forEach(name => {
                ((function (cookie) {
                    self.jar.setCookie(request.cookie(cookie), 'https://steamcommunity.com');
                })(name));
            });
        } else {
            this.credentials = options.credentials;
        }

        

        this.confirmations = options.confirmations;
        this.sellInterval =  options.sellInterval;
    }
    logOn(callback) {

        if (!this.steamcommunity) {
            this.steamcommunity = new steamcommunity();

            let options = {
                accountName: this.credentials.login,
                password: this.credentials.password,
                twoFactorCode: steamTotp.generateAuthCode(this.credentials.shared_secret),
                disableMobile: false
            };

            this.steamcommunity.login(options, (err, sessionID, cookies) => {
                if (err) throw err;

                this.sessionID = sessionID;
                this.cookies = cookies;


                let self = this;
                self.jar = request.jar();
                cookies.forEach(name => {
                    ((function (cookie) {
                        self.jar.setCookie(request.cookie(cookie), 'https://steamcommunity.com');
                    })(name));
                });

                this.startTradeOffers(callback);
            });
        } else {
            this.startTradeOffers(callback);
        }



    }
    startTradeOffers(callback) {
        if(this.confirmations){
            this.steamcommunity.startConfirmationChecker(this.sellInterval, this.credentials.identity_secret);
        }

        if (this.apiKey) {
            this.tradeOffers = new steamTradeOffers();
            this.tradeOffers.setup({
                sessionID: this.sessionID,
                webCookie: this.cookies,
                APIKey: this.apiKey
            });
            return callback();
        }

        let self = this;
        this.steamcommunity.getWebApiKey('http://localhost', function (err, apiKey) {
            if (err) throw err;

            self.apiKey = apiKey;

            self.tradeOffers = new steamTradeOffers();
            self.tradeOffers.setup({
                sessionID: self.sessionID,
                webCookie: self.cookies,
                APIKey: self.apiKey
            });
            return callback();
        });
    }

    loadMyInventory(gameCode, callback) {
        this.tradeOffers.loadMyInventory({
            appId: gameCode,
            contextId: 2,
            tradableOnly: false
        }, function (err, inv) {
            callback(err, inv);
        });
    }
    processInventory(apiInv) {
        let inv = {};
        let numOfItems = 0;
        for (let i = 0; i < apiInv.length; i++) {
            let item = apiInv[i];

            if (!item.marketable) continue;
            if (!inv[item.market_hash_name]) {
                inv[item.market_hash_name] = [];
            }

            numOfItems++;;
            inv[item.market_hash_name].push({
                assetid: item.id,
                contextid: item.contextid
            });
        }
        return { inv, numOfItems };
    }
    refreshSession(callback) {
        this.steamUser.webLogOn();
        let self = this;
        this.steamUser.once('webSession', function (sessionID, cookies) {
            self.cookies = cookies;
            self.sessionID = sessionID;
            self.steamcommunity.setCookies(cookies);
            self.jar = request.jar();
            cookies.forEach(name => {
                ((function (cookie) {
                    self.jar.setCookie(request.cookie(cookie), 'https://steamcommunity.com');
                })(name));
            });

            callback(this.accountInfo.name, self.steamUser.steamID);
        });

    }



}

module.exports = steamHandler;