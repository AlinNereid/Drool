/**
 * Created by alin on 5/17/14.
 */
var request = require('request');
var dbAPITicker = require('../models/dbAPITicker');
var getValue=function(obiect){

}
var getCurrencyDigitalCoin = function (sname, callback) {
    dbAPITicker.getDigitalCoins(sname, function (apiTickerValue) {
        var url = apiTickerValue[0].urlTicker;
        request(url, function (err, resp, body) {
            if (err) return console.error(sname + " " + err)
            else {
                try {
                    var date = JSON.parse(body);
                    var array = apiTickerValue[0].last.split(",");
                    var last=date[array[0]];
                    var bid="";
                    var avg_24h="";
                    var volume="";
                    for(i=1;i<array.length;i++){
                        last=last[array[i]];
                    }
                    if(apiTickerValue[0].bid!=""){
                        var array = apiTickerValue[0].bid.split(",");
                        bid=date[array[0]];
                        for(i=1;i<array.length;i++){
                            bid=bid[array[i]];
                        }
                    }
                    if(apiTickerValue[0].avg_24h!=""){
                        var array = apiTickerValue[0].avg_24h.split(",");
                        avg_24h=date[array[0]];
                        for(i=1;i<array.length;i++){
                            avg_24h=avg_24h[array[i]];
                        }
                    }
                    if(apiTickerValue[0].volume!=""){
                        var array = apiTickerValue[0].volume.split(",");
                        volume=date[array[0]];
                        for(i=1;i<array.length;i++){
                            volume=volume[array[i]];
                        }
                    }
                    var dateDinApi = {
                        last : last,
                        bid : bid,
                        avg_24 : avg_24h,
                        volume : volume,
                        date : Date.now()
                    }
                    dbAPITicker.addDateApi(sname,dateDinApi,function(checkInserted){
                        if(checkInserted==false)
                            console.log(sname+" Can't insert "+dateDinApi);
                    });
                }
                catch (e) {
                    console.error(sname + "  ----   Parsing error:", e);
                }
            }
        });
    })
};
exports.getCurrency = getCurrencyDigitalCoin;