let SteamMarketSell = require('steam-market-sell');

let steamTotp = require('steam-totp');

let credentials = {
    login: "",
    password: "",
    shared_secret: "",   //You need to activate 2FA authentication to sell items on community market. You can do this using this script : https://github.com/irqize/node-steam-activate-2fa
    identity_secret: ""
};


//ALTERNATIVE OPTIONS
/*let options = {    
    currencyCode : 6,
    appID : 730,
    sellInterval: 4000,
    credentials,
    confirmations : true
};*/


let SteamCommunity = require('steamcommunity')
let steamcommunity = new SteamCommunity();

steamcommunity.login({
    accountName: credentials.login,
    password: credentials.password,
    twoFactorCode: steamTotp.generateAuthCode(credentials.shared_secret),

}, (err, sessionID, cookies) => {
    let options = {
        currencyCode: 6,
        appID: 730,
        sellInterval: 4000,
        steamcommunity,
        sessionID,
        cookies,
        confirmations: false
    }

    let steamMarketSell = new SteamMarketSell(options);

    steamMarketSell.init(() => {
        let priceOfChroma;
        steamMarketSell.getPrice('Chroma 3 Case', true, (err, price) => {
            if (err) console.log(err);
            else priceOfChroma = price;
        });

        steamMarketSell.sellAllItems(true, () => {

        });

        steamMarketSell.on('item sold', (info) => {
            console.log(info)
        })
        steamMarketSell.on('item not sold', (info) => {
            console.log('not sold');
            console.log(info)
        })
    });

});



