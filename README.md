# node-steam-market-sell
simple node.js module with functions needed to sell items on steam comunity market

## Documentation
node-steam-tradeoffer-manager is a node.js module for managing Trade Offers within the Steam platform.

When you require() the module, the SteamMarketSell class is returned.

### Constructor({options})
There are two ways of initializing this class. You can pass already logged in steamcommunity instance with sessionID and cookies  or just pass account's credentials and let it do the work.


### Needed options when passing steamcommunity instance

#### currencyCode
Number of currency used on account (https://github.com/SteamRE/SteamKit/blob/master/Resources/SteamLanguage/enums.steamd#L856)
#### appID
AppID of game of which items you will be selling/getting price.
### sellInterval
How frequently request to steam will be sent in ms (default: 4000)
### credentials
Object containing steam login info
### credentials.login
Login to account
### credentials.password
Password to account
### credentials.shared_secret
shared_secret of account
### credentials.identity_secret
identity_secret of account
### confirmations
Boolean, if you want module to use startConfirmationChecker method on steamcommunity with sellInterval as an argument.

### Needed options when passing steamcommunity instance

#### currencyCode
Number of currency used on account (https://github.com/SteamRE/SteamKit/blob/master/Resources/SteamLanguage/enums.steamd#L856)
#### appID
AppID of game of which items you will be selling/getting price.
### sellInterval
How frequently request to steam will be sent in ms (default: 4000)
### steamcommunity
SteamCommunity instance
### sessionID
Can be owned in callback in steamcommunity's ```login``` method.
### cookies
Can be owned in callback in steamcommunity's ```login``` method.
### confirmations
Boolean, if you want module to use startConfirmationChecker method on steamcommunity with sellInterval as an argument. However you have to pass credentials.identity_secret in options to have it working.


