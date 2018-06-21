# node-steam-market-sell
simple node.js module with functions needed to sell items on steam comunity market

DISCLAIMER : Using bots is against Steam's TOS (```You may not use Cheats, automation software (bots), mods, hacks, or any other unauthorized third-party software, to modify or automate any Subscription Marketplace process.```). I do not take any responsibility for any damage that using this script may cause.

## Instalation
Just run ```npm i steam-market-sell``` inside your project's directory.

## Usage
Check ```example.js``` file in this repo to see how to initialize and use basic methods of this module.

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


## Methods
After creating SteamMarketSell instance you have to run init method to be able to use other ones.
### init
Logs in to Steam and/or initializes whole module, depending on constructor options
- callback
### sellAllItems
Sells all marketable items from specified game
- useLowestPrices
True for using lowest prices, false for median
- callback
Callback passes no values, listen for events to get info about sellings
### sellItem
Sells single item
- assetID
- contextID
- price
- callback
    - err
### getPrice
- market_hash_name
Market name of item
- useLowestPrices
True for using lowest prices, false for median
- callback
    - err
    - price
### loadAndProcessInventory
Downloads and processes inventory in object which properties are ```market_hash_name``` of items which goes to array of objects with properties ```assetid``` and ```contextid```.
- callback
    - err
    - processedInv


## Events
### 'log on'
Triggered when whole module is ready to work
### 'item sold'
Triggered when item sold during ```sellAllItems``` method execution
- sellInfo
    - name
    - assetid
    - contextid
    - price
### 'item not sold'
Triggered when error occured while selling item during ```sellAllItems``` method execution
- err
- sellInfo
    - name
    - assetid
    - contextid
    - price
### 'loaded inventory'
Triggered when loaded inventory during ```sellAllItems``` method execution, can be accessed by ```inv``` property of module


## Properties
### inv
Inventory of account accessible after 'loaded inventory' event is triggered.