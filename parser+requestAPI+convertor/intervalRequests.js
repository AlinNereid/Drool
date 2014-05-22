/**
 * Created by alin on 5/18/14.
 */
var refreshIntervalID = {};
var digitalCoins = require('./digitalCoins');
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
exports.addInterval=addInInterval;
exports.removeInterval=removeInterval;