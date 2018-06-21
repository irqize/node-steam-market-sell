
let request = require('request');
let timeout = 30000;


class apiRequests{
    constructor(currencyCode, steamHandler, appID){
        this.currencyCode = currencyCode;
        this.steamHandler = steamHandler;
        this.appID = appID;

        this.requestCommunity = request.defaults({
            timeout: timeout,
            jar : steamHandler.jar
        });
    }
    getPrice(market_hash_name, useLowestPrices, callback){
        let link = 'https://steamcommunity.com/market/priceoverview/?appid='+this.appID+'&country=PL&currency='+this.currencyCode+'&market_hash_name='+encodeURIComponent(market_hash_name);
        request.get(link,  (err, res, body) => {
			try{
				if(err || !res)return callback(err);
				if(res.statusCode == 429) callback('Request Spam');
				if(res.statusCode != 200) return callback('Response Error'+err?err:res.statusCode);
				res = JSON.parse(body);
				if(!res.success)return callback('Api Error');
				let price;
				
				if(useLowestPrices == false || !res.lowest_price) price = res.median_price.substr(0, res.median_price.indexOf(',')+3);
				else price = res.lowest_price.substr(0, res.lowest_price.indexOf(',')+3);
	
				price = Number(price.replace(',','.'));
	
				callback(null, price);
			}catch(err){
				     callback(err);
			}            
        });
    }
    sellItem(assetID, contextID,  price, callback){
            if(!price) return callback('No price');

            let link = 'https://steamcommunity.com/market/sellitem/';

            price = Math.floor((Number(price)/1.15 - 0.01)*100);
            let data =
            {
                "sessionid": this.steamHandler.sessionID,
                "appid": this.appID+'',
                "contextid": contextID+'',
                "assetid": assetID,
                "amount": 1,
                "price": price+''
            }

            let headers = {
                "Accept": "*/*",
                'Origin': 'https://steamcommunity.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': 'https://steamcommunity.com/profiles/'+this.steamHandler.steamcommunity.steamID.getSteamID64()+'/inventory/',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'pl-PL,pl;q=0.8,en-US;q=0.6,en;q=0.4',
                'Host' : 'steamcommunity.com'
            };

            
            this.requestCommunity.post({
                url : link,
                form : data,
                headers : headers
            }, function (err, res, body){
                if(err) return callback(err);
                if(!res) return callback(new Error('Unknown error'));
                try{
                    let jsonRes = JSON.parse(body);

                    if(!jsonRes.success){
                        return callback(new Error(jsonRes.message));
                    }
                }catch(err){
                    return callback(err);
                }

                if(res.statusCode == 200){
                    return callback(null,body);
                }
                return callback(new Error('HTTP Code '+res.statusCode));

            });
            
    }
}

module.exports = apiRequests;