/**
 * Created by alin on 5/17/14.
 */
var myParseFloat=function(string){
    var x = parseFloat(string);
    if(isNaN(x)){
        return "";
    }else{
        return x;
    }
}
var dbRealCoins = require('../models/dbRealCoins');
var request = require('request');
var getCurrencyReal=function(url,numeApi,callback){
    request(url,function(err, resp, body){
        if (err) console.error("Error getCurrency" + err)
        else{
            if(numeApi=="yahooFinance"){
                try {
                    var date=JSON.parse(body);
                    date=date.list.resources;
                    /*var dateAPI={
                        "date":date,
                        "nameApi":numeApi,
                        "dataServer":Date.now()
                    }*/
                    console.log("Update yahooFinance")
                    for(i=0;i<date.length;i++){
                        var realCoin = new dbRealCoins.RealCoin(date[i].resource.fields.symbol.substring(0,date[i].resource.fields.symbol.length-2),myParseFloat(date[i].resource.fields.price),date[i].resource.fields.utctime);
                        dbRealCoins.addRealCoin(realCoin);
                    }
                }
                catch (e) {
                    console.error(numeApi+"  ----   Parsing error:", e);
                }
            }
        }
    });
};
exports.getRealCurrency=getCurrencyReal;