/**
 * Created by alin on 5/17/14.
 */
var request = require('request');
var dbAPITicker = require('../models/dbAPITicker');
if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
    };
}
var getValue = function (obiect) {

}
var getCurrencyDigitalCoin = function (sname, callback) {
    dbAPITicker.getDigitalCoins(sname, function (apiTickerValue) {
        try {
            var url = apiTickerValue[0].urlTicker;
            request(url, function (err, resp, body) {
                if (err) return console.error(sname + " " + err)
                else {
                    try {
                        var date = JSON.parse(body);
                        var bid = "";
                        var avg_24h = "";
                        var volume = "";

                        var array = apiTickerValue[0].last.split(",");
                        var isNumberArray=false;
                        if(array[0].startsWith("ArrayDrool")){
                            isNumberArray=true;
                        }
                        if(isNumberArray==true){
                            var last = date[array[0].substring(10,array[0].length)];
                        }else{
                            var last = date[array[0]];
                        }
                        for (i = 1; i < array.length; i++) {
                            if(isNumberArray==true){
                                last = last[parseInt(array[i])];
                                isNumberArray=false;
                            }else{
                                if(array[i].startsWith("ArrayDrool")){
                                    isNumberArray=true;
                                }
                                if(isNumberArray==true){
                                    last = last[array[i].substring(10,array[i].length)];
                                }else{
                                    last = last[array[i]];
                                }
                            }
                        }
                        isNumberArray=false;
                        if (apiTickerValue[0].bid != "") {
                            var array = apiTickerValue[0].bid.split(",");
                            var isNumberArray=false;
                            if(array[0].startsWith("ArrayDrool")){
                                isNumberArray=true;
                            }
                            if(isNumberArray==true){
                                var bid = date[array[0].substring(10,array[0].length)];
                            }else{
                                var bid = date[array[0]];
                            }
                            for (i = 1; i < array.length; i++) {
                                if(isNumberArray==true){
                                    bid = bid[parseInt(array[i])];
                                    isNumberArray=false;
                                }else{
                                    if(array[i].startsWith("ArrayDrool")){
                                        isNumberArray=true;
                                    }
                                    if(isNumberArray==true){
                                        bid = bid[array[i].substring(10,array[i].length)];
                                    }else{
                                        bid = bid[array[i]];
                                    }
                                }
                            }
                        }
                        if (apiTickerValue[0].avg_24h != "") {
                            var array = apiTickerValue[0].avg_24h.split(",");
                            var isNumberArray=false;
                            if(array[0].startsWith("ArrayDrool")){
                                isNumberArray=true;
                            }
                            if(isNumberArray==true){
                                var avg_24h = date[array[0].substring(10,array[0].length)];
                            }else{
                                var avg_24h = date[array[0]];
                            }
                            for (i = 1; i < array.length; i++) {
                                if(isNumberArray==true){
                                    avg_24h = avg_24h[parseInt(array[i])];
                                    isNumberArray=false;
                                }else{
                                    if(array[i].startsWith("ArrayDrool")){
                                        isNumberArray=true;
                                    }
                                    if(isNumberArray==true){
                                        avg_24h = avg_24h[array[i].substring(10,array[i].length)];
                                    }else{
                                        avg_24h = avg_24h[array[i]];
                                    }
                                }
                            }
                        }
                        if (apiTickerValue[0].volume != "") {
                            var array = apiTickerValue[0].volume.split(",");
                            var isNumberArray=false;
                            if(array[0].startsWith("ArrayDrool")){
                                isNumberArray=true;
                            }
                            if(isNumberArray==true){
                                var volume = date[array[0].substring(10,array[0].length)];
                            }else{
                                var volume = date[array[0]];
                            }
                            for (i = 1; i < array.length; i++) {
                                if(isNumberArray==true){
                                    volume = volume[parseInt(array[i])];
                                    isNumberArray=false;
                                }else{
                                    if(array[i].startsWith("ArrayDrool")){
                                        isNumberArray=true;
                                    }
                                    if(isNumberArray==true){
                                        volume = volume[array[i].substring(10,array[i].length)];
                                    }else{
                                        volume = volume[array[i]];
                                    }
                                }
                            }
                        }
                        var dateDinApi = {
                            last: last,
                            bid: bid,
                            avg_24: avg_24h,
                            volume: volume,
                            date: Date.now()
                        }
                        dbAPITicker.addDateApi(sname, dateDinApi, function (checkInserted) {
                            if (checkInserted == false)
                                console.log(sname + " Can't insert " + dateDinApi);
                        });
                    }
                    catch (e) {
                        console.error(sname + "  ----   Parsing error:", e);
                    }
                }
            });
        } catch (e) {
            console.error(sname + "  ----   date error:", e);
        }
    })
};
exports.getCurrency = getCurrencyDigitalCoin;