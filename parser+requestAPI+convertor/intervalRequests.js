/**
 * Created by alin on 5/18/14.
 */
var refreshIntervalID = {};
var digitalCoins = require('./digitalCoins');
var dbAPITicker = require('../models/dbAPITicker');

var addInInterval = function(sname,intervalUpdate){
    if(refreshIntervalID.hasOwnProperty(sname)){
        console.log("Exista timer pe "+ sname);
    }else{
        refreshIntervalID[sname]=setInterval(digitalCoins.getCurrency,intervalUpdate,sname);
    }
}
var removeInterval = function(sname){
    if(refreshIntervalID.hasOwnProperty(sname)){
        clearInterval(refreshIntervalID[sname]);
        delete refreshIntervalID[sname];
        console.log("Am sters requestul Interval");
    }
}
var StartAllApi=function(){
    for(key in refreshIntervalID){
        removeInterval(key);
    }
    dbAPITicker.getAllApis(function(apis){
        for(i=0;i<apis.length;i++){
            digitalCoins.getCurrency(apis[i].sname);
            addInInterval(apis[i].sname,apis[i].requestTime);
        }
        console.log("Start all apis requests!")
    });
}
exports.StartAllApi=StartAllApi
exports.addInterval=addInInterval;
exports.removeInterval=removeInterval;