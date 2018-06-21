let SteamHandler = require('./lib/steamHandler');
let ApiRequests = require('./lib/apiRequests');

const EventEmitter = require('events');

class SteamMarketSell extends EventEmitter {
    constructor(options) {
        super();
        if(options.sessionID && options.cookies && options.steamcommunity){
            this.steamHandler = new SteamHandler({sessionID : options.sessionID, cookies : options.cookies, steamcommunity : options.steamcommunity, confirmations : options.confirmations, sellInterval : options.sellInterval});
        }
        else if(options.credentials){  
            this.steamHandler = new SteamHandler({credentials : options.credentials, confirmations : options.confirmations, sellInterval : options.sellInterval});
        }
        else throw new Error(`You need to pass in options credentials of steam account or steamcommunity instance with sessionID and web cookies.`);

        this.currencyCode = options.currencyCode;
        this.appID = options.appID;
        this.sellInterval = options.sellInterval || 4000;

        
    }

    init(callback){
        this.steamHandler.logOn(()=>{
            this.apiRequests = new ApiRequests(this.currencyCode, this.steamHandler, this.appID);

            this.sellItem = this.apiRequests.sellItem;

            this.getPrice = this.apiRequests.getPrice;

            this.emit('log on');

            if(callback) return callback();
        });
    }

    

    _getInventory(callback){
        this.steamHandler.loadMyInventory(this.appID, (err, inv) => {
            if(err) return callback(err);

            let processedInv = this.steamHandler.processInventory(inv);
            
            callback(null, processedInv);
        })
    }

    _getPrice(name, useLowestPrices){
        return new Promise((resolve, reject) => {
            this.apiRequests.getPrice(name, useLowestPrices, (err, price) =>{
                if(err) reject(err);
                resolve(price);
            });
        });
    }



    _sellItem(id,context, price){
        return new Promise((resolve, reject) => {
            this.apiRequests.sellItem(id, context, price, (err) => {
                if(err) reject(err);
                resolve();
            })
        })
    }
    
    _sellInterval(){
        return new Promise(resolve => {
            setTimeout(resolve, this.sellInterval);
        }) 
    }

    async _sellAllItemsByName(name, useLowestPrices){
        let price = await this._getPrice(name, useLowestPrices);

        for(let i=0;i<this.inv.inv[name].length;i++){
            let sellInfo = {
                name : name,
                assetid : this.inv.inv[name][i].assetid,
                contextid : this.inv.inv[name][i].contextid,
                price : price
            };

            await this._sellItem(this.inv.inv[name][i].assetid, this.inv.inv[name][i].contextid, price)
            .then(()=> this.emit('item sold', sellInfo))
            .catch((err) => this.emit('item not sold', err, sellInfo));

            await this._sellInterval();
        }
    }

    sellAllItems(useLowestPrices, callback){
        this._getInventory(async (err, inv) => {
            if(err) return callback(err);

            this.emit('loaded inventory', inv);

            this.inv = inv;

            for(let name in this.inv.inv){
                await this._sellAllItemsByName(name, useLowestPrices);
            }

            if(callback) return callback();
        });
    }

    loadAndProcessInventory(callback){
        this.steamHandler.loadMyInventory(this.appID, (err, inv) => {
            if(err) return callback(err);

            let processedInv = this.steamHandler.processInventory(inv);
            
            callback(null, processedInv);
        })
    }

}


module.exports = SteamMarketSell;

/*
options = {
    sessionID : '',
    cookies: [],
    steamcommunity: steamcommunity,
    currencyCode: 0,
    appID: 730,
    sellInterval: 4000,
    credentials: {
        login: "",
        password: "",
        shared_secret: "",   //You need to activate 2FA authentication to sell items on community market. You can do this using this script : https://github.com/irqize/node-steam-activate-2fa
        identity_secret: "",
    }
    confirmations : true
}
*/