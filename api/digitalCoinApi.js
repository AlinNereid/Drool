/**
 * Created by alin on 5/22/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbApiTicker = require('../models/dbAPITicker');
var dbRealCoins = require('../models/dbRealCoins');

var existsRealCoinSname = function (digsname, callback) {
    dbRealCoins.getAllRealSymbolCoins(function (dname) {
        for (i = 0; i < dname.length; i++) {
            //console.log(dname[i].symbol)
            if (digsname == dname[i].symbol) {
                console.log(dname[i] + " " + digsname);
                callback(true)
            }
        }
        if (i == dname.length) {
            callback(false);
        }
    });
}
var existsDigitalCoin = function (digsname, callback) {
    dbDigitalCoins.getAllDigitalSNameCoins(function (snames) {
        for (i = 0; i < snames.length; i++) {
            if (digsname == snames[i].sname) {
                console.log(snames[i] + " " + digsname);

                callback(true);
                break;
            }
        }
        if (i == snames.length) {
            callback(false);
        }
    });
}

var GETallDigitalCoin=function(req,res){
    res.contentType('application/json');
    dbDigitalCoins.getAllDigitalCoins(function(coins){
        res.send(coins);
    });
}
var PUTByName=function(req,res){
    var sname = req.param('sname', "");
    var lname = req.param('lname', "");
    var page = req.param('page', "");
    res.contentType('application/json');
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (sname !== "" && sname !== null && sname == req.params.nameDigital){
        sname = sname.toUpperCase();
        existsDigitalCoin(sname,function(exits){
            if(exits==true){
                existsRealCoinSname(sname, function (existaRealSname) {
                    if (existaRealSname == false)
                        dbDigitalCoins.updateDigitalCoin(new dbDigitalCoins.DigitalCoin(sname, lname, page), function (exista) {
                            if (exista == true) {
                                res.send({updated:true,url:fullUrl})
                            }
                            else
                                res.send({error: "Moneda exista in baza de date"});
                        })
                    else {
                        res.send({error: "Exista Moneda reala cu acelasi nume date"});
                    }
                });
            }
            else{
                res.send({error: "Nu Exista sname + doc"});
            }
        });
    }
    else {
        res.send({error: "Date invalide + doc"});
    }
}
var POSTinROOT = function(req,res){
    var sname = req.param('sname', "");
    var lname = req.param('lname', "");
    var page = req.param('page', "");
    res.contentType('application/json');
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (sname !== "" && sname !== null && sname == req.params.nameDigital){
        sname = sname.toUpperCase();
        existsRealCoinSname(sname, function (existaRealSname) {
            if (existaRealSname == false)
                dbDigitalCoins.addDigitalCoin(new dbDigitalCoins.DigitalCoin(sname, lname, page), function (exista) {
                    if (exista == true) {
                        res.send({added:true,url:fullUrl+'/'+sname})
                    }
                    else
                        res.send({error: "Moneda exista in baza de date"});
                })
            else {
                res.send({error: "Exista Moneda reala cu acelasi nume date"});
            }
        });
    }
    else {
        res.send({error: "Date invalide + doc"});
    }
}
var GETByName=function(req,res){
    res.contentType('application/json');
    dbDigitalCoins.getDigitalCoin(req.params.nameDigital,function(coin){
        if(coin!=null)
            res.send(coin);
        else{
        res.send({error:'Invalid digitalCurrency'});
        }
    });
}
var DELETEByName = function(req,res){
    res.contentType('application/json');
    var sname = req.params.nameDigital;
        dbApiTicker.deleteAllApiWithDigital(sname, function (apisDeleted) {
            dbDigitalCoins.deleteDigitalCoin(sname, function (digitalCoins) {
                if (digitalCoins == true)
                    res.send({deleted:true});
                else {
                    res.send({error: "Date invalide + doc"});
                }
            });
        });
}
exports.GETall=GETallDigitalCoin;
exports.POSTinROOT=POSTinROOT;
exports.GETByNameDigital = GETByName;
exports.PUTByNameDigital = PUTByName;
exports.DELETEByName = DELETEByName;