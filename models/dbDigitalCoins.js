/**
 * Created by alin on 5/17/14.
 */
var nameCollection="digitalCoins";
var database=require('./database.js');
//class for a digitalCoin
exports.DigitalCoin = function DigitalCoin(sname,lname,page){
    this.sname=sname;
    this.lname=lname;
    this.page=page;
    return this;
}
//add a digitalcoin into db
exports.addDigitalCoin= function(digCoin,callback){
    console.log("ADD DIGITAL :" +digCoin);
    database.getDatabase().collection(nameCollection).insert(digCoin
    ,function (err, inserted) {
        console.log(err);
        if(err)
            callback(false);
        else
            callback(true);
    });
};
//update a digitalcoin from db
exports.updateDigitalCoin = function(digCoin,callback){
    console.log("UPDATE DIGITAL :"+digCoin);
    database.getDatabase().collection(nameCollection).update({sname:digCoin.sname},digCoin
        ,function (err, inserted) {
            console.log(err);
            if(err)
                callback(false);
            else
                callback(true);
        });
}
//delete a digitalcoin from db
exports.deleteDigitalCoin = function(sname,callback){
    console.log("DELETE DIGITAL " + sname);
    database.getDatabase().collection(nameCollection).remove({sname:sname},function (err, numDeleted) {
        if(numDeleted == 0 || err){
            callback(false);
        }
        else
            callback(true);
    });
}
//get a digitalcoin from db
exports.getDigitalCoin=function(sname,callback){
    database.getDatabase().collection(nameCollection).findOne({sname:sname},{_id:0},function(err, coins){
        //console.log(coins);
        callback(coins);
    });
}
//get all sname from digitalCoins
exports.getAllDigitalSNameCoins = function(callback){
    database.getDatabase().collection(nameCollection).find({},{_id:0,sname:1}).toArray(function(err, coins){
//        console.log("retrieved records:");
//        console.log(coins);
        callback(coins);
    });
}
//get all digitalCoins
exports.getAllDigitalCoins = function(callback){
    database.getDatabase().collection(nameCollection).find({},{_id:0}).toArray(function(err, coins){
       // console.log("retrieved records:");
       // console.log(coins);
        callback(coins);
    });
}