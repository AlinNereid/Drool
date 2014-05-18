/**
 * Created by alin on 5/17/14.
 */
var nameCollection="ApiTickers"
var database=require('./database.js');
exports.ApiTicker = function ApiTicker(sname,urlTicker,digsname,realsname,last,requestTime,bid,avg_24h,volume){
    this.sname=sname;
    this.urlTicker=urlTicker;
    this.digsname=digsname;
    this.realsname=realsname;
    this.last=last;
    this.requestTime=requestTime;
    this.bid=bid;
    this.avg_24h=avg_24h;
    this.volume=volume;
    return this;
}
exports.addApiTicker= function(apiTicker,callback){
    console.log(apiTicker);
    database.getDatabase().collection(nameCollection).insert(apiTicker
        ,function (err, inserted) {
            console.log(err);
            if(err)
                callback(false);
            else
                callback(true);
        });
};
exports.getDigitalCoins = function(sname,callback){
    database.getDatabase().collection(nameCollection).find({sname:sname},{_id:0}).toArray(function(err, docs){
        console.log("retrieved records:");
        console.log(docs);
        callback(docs);
    });
}
exports.getAllApis = function(callback){
    database.getDatabase().collection(nameCollection).find({},{_id:0}).toArray(function(err, apis){
        console.log("retrieved records:");
        console.log(apis);
        callback(apis);
    });
}

exports.addDateApi=function(sname,dataApi,callback){
    database.getDatabase().collection(sname).insert(dataApi,function (err, inserted) {
            if(err)
                callback(false);
            else
                callback(true);
        });
}