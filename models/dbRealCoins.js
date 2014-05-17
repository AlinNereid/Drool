/**
 * Created by alin on 5/17/14.
 */
var nameCollection="YahooFinanceCurrency";
var database=require('./database.js');

exports.RealCoin = function RealCoin(symbol,price,utctime){
    this.symbol=symbol;
    this.price=price;
    this.utctime=utctime;
    return this;
}
exports.addRealCoin= function(realCoin){
    //console.log(realCoin);
    database.getDatabase().collection(nameCollection).update({"symbol":realCoin.symbol},realCoin,{"upsert":true}, function (err, inserted) {
            if(err)
                console.log(nameCollection + " erroare")
        });
};
exports.getAllRealSymbolPriceCoins = function(callback){
    database.getDatabase().collection(nameCollection).find({},{_id:0,symbol:1,price:1}).toArray(function(err, coins){
//        console.log("retrieved records:");
//        console.log(coins);
        callback(coins);
    });
}
exports.getAllRealSymbolCoins = function(callback){
    database.getDatabase().collection(nameCollection).find({},{_id:0,symbol:1}).toArray(function(err, coins){
//        console.log("retrieved records:");
//        console.log(coins);
        callback(coins);
    });
}
exports.getAllRealCoins = function(callback){
    database.getDatabase().collection(nameCollection).find().toArray(function(err, coins){
       // console.log("retrieved records:");
        //console.log(coins);
        callback(coins);
    });
}