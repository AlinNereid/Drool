/**
 * Created by alin on 5/17/14.
 */
var nameCollection="digitalCoins";
var database=require('./database.js');
exports.DigitalCoin = function DigitalCoin(sname,lname,page){
    this.sname=sname;
    this.lname=lname;
    this.page=page;
    return this;
}
exports.addDigitalCoin= function(digCoin,callback){
    console.log(digCoin);
    database.getDatabase().collection(nameCollection).insert(digCoin
    ,function (err, inserted) {
        console.log(err);
        if(err)
            callback(false);
        else
            callback(true);
    });
};
exports.getAllDigitalSNameCoins = function(callback){
    database.getDatabase().collection(nameCollection).find({},{_id:0,sname:1}).toArray(function(err, coins){
//        console.log("retrieved records:");
//        console.log(coins);
        callback(coins);
    });
}
exports.getAllDigitalCoins = function(callback){
    database.getDatabase().collection(nameCollection).find({},{_id:0}).toArray(function(err, coins){
       // console.log("retrieved records:");
       // console.log(coins);
        callback(coins);
    });
}