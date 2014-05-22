/**
 * Created by alin on 5/17/14.
 */
var nameCollection="ApiTickers"
var database=require('./database.js');
var intervalRequests = require('../parser+requestAPI+convertor/intervalRequests');
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
exports.getApiTicker = function(sname,callback){
    database.getDatabase().collection(nameCollection).findOne({sname:sname},{_id:0},function(err, api){
     /*   console.log("retrieved records:");
        console.log(api);*/
        callback(api);
    });
}
exports.getAllApis = function(callback){
    database.getDatabase().collection(nameCollection).find({},{_id:0}).toArray(function(err, apis){
        /*console.log("retrieved records:");
        console.log(apis);*/
        callback(apis);
    });
}
exports.getAllApisWithDigSname = function(dname,callback){
    database.getDatabase().collection(nameCollection).find({digsname:dname},{_id:0}).toArray(function(err, apis){
        /*console.log("retrieved records:");
         console.log(apis);*/
        callback(apis);
    });
}
exports.updateApi = function(apiTicker,callback){
    console.log(apiTicker);
    database.getDatabase().collection(nameCollection).update({sname:apiTicker.sname},apiTicker,function (err, inserted) {
            console.log(err);
            if(err)
                callback(false);
            else
                callback(true);
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
exports.getLastValue=function(sname,callback){
    database.getDatabase().collection(sname).find({},{_id:0}).sort({date:-1}).limit(1).toArray(function(err, results) {
        callback(results[0]);
    });
}
exports.deleteApi= function(sname,callback){
    console.log("Delete " + sname);
    database.getDatabase().collection(nameCollection).remove({sname:sname},function (err, numDeleted) {
        if(numDeleted == 0 || err){
            callback(false);
        }
        else{
            intervalRequests.removeInterval(sname);
            database.getDatabase().collection(sname).drop(function(err,deleted){
                console.log("Drop " +sname +  " "+deleted);
            });
            callback(true);
        }
    });
}
exports.deleteAllApiWithDigital = function(digsname,callback){
    console.log("Delete all api with " + digsname);
    database.getDatabase().collection(nameCollection).find({digsname:digsname},{_id:0,sname:1}).toArray(function(err,snames){
        database.getDatabase().collection(nameCollection).remove({digsname:digsname},function (err, numDeleted) {
            snames.forEach(function(snameObj){
                intervalRequests.removeInterval(snameObj.sname);
                database.getDatabase().collection(snameObj.sname).drop(function(err,deleted){
                    console.log("Drop " + snameObj.sname );
                });
            });
            if(numDeleted == 0 || err){
                callback(false);
            }
            else
                callback(true);
        });

    })

}