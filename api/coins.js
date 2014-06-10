/**
 * Created by alin on 5/24/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbRealCoins = require('../models/dbRealCoins');
//get ALL coins from db and respond with a JSON
var getCoins = function(req,res){
    res.contentType('application/json');
    var allCoins=[];
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    dbRealCoins.getAllRealCoins(function(realcoins){
        for(var i=0;i<realcoins.length;i++)
            if (fullUrl.endsWith("/"))
                allCoins.push({type:"real",coin : realcoins[i].symbol, url : fullUrl + "real/"+ realcoins[i].symbol})
            else
                allCoins.push({type:"real",coin : realcoins[i].symbol, url : fullUrl + "/real/"+ realcoins[i].symbol})
       dbDigitalCoins.getAllDigitalCoins(function(digitalCoins){
           for(var i=0;i<digitalCoins.length;i++)
               if (fullUrl.endsWith("/"))
                   allCoins.push({type:"digital",coin : digitalCoins[i].sname, url : fullUrl + "digital/"+ digitalCoins[i].sname})
                else
                   allCoins.push({type:"digital",coin : digitalCoins[i].sname, url : fullUrl + "/digital/"+ digitalCoins[i].sname})
           res.send(allCoins);
       })
    });
}
exports.GETcoins = getCoins;