/**
 * Created by alin on 5/22/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbApiTicker = require('../models/dbAPITicker');
var dbRealCoins = require('../models/dbRealCoins');
var credential = require('../api/credentials');
var errors=require('../errors/errors');
errors=errors.errors;
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
//verify if a realcoin with realsname exists and callback with true or false
var existsRealCoinSname = function (digsname, callback) {
    dbRealCoins.getAllRealSymbolCoins(function (dname) {
        for (i = 0; i < dname.length; i++) {
            //console.log(dname[i].symbol)
            if (digsname == dname[i].symbol) {
                //console.log(dname[i] + " " + digsname);
                callback(true)
            }
        }
        if (i == dname.length) {
            callback(false);
        }
    });
}
//verify if a digitalcoin with digsname exists and callback with true or false
var existsDigitalCoin = function (digsname, callback) {
    dbDigitalCoins.getAllDigitalSNameCoins(function (snames) {
        for (i = 0; i < snames.length; i++) {
            if (digsname == snames[i].sname) {
                //console.log(snames[i] + " " + digsname);

                callback(true);
                break;
            }
        }
        if (i == snames.length) {
            callback(false);
        }
    });
}
//get all digitalCoins and respond  with JSON
var GETallDigitalCoin = function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.contentType('application/json');
    dbDigitalCoins.getAllDigitalCoins(function (coins) {
        for (i = 0; i < coins.length; i++) {
            if (fullUrl.endsWith("/"))
                coins[i].url = fullUrl + coins[i].sname;
            else
                coins[i].url = fullUrl + '/' + coins[i].sname;
        }
        res.send(coins);
    });
}
//edit a digitalCoin, need sname, opt lname and page
var PUTByName = function (req, res) {
    var sname = req.param('sname', "");
    var lname = req.param('lname', "");
    var page = req.param('page', "");
    res.contentType('application/json');
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (sname !== "" && sname !== null && sname == req.params.nameDigital) {
        sname = sname.toUpperCase();
        existsDigitalCoin(sname, function (exits) {
            if (exits == true) {
                existsRealCoinSname(sname, function (existaRealSname) {
                    if (existaRealSname == false)
                        dbDigitalCoins.updateDigitalCoin(new dbDigitalCoins.DigitalCoin(sname, lname, page), function (exista) {
                            if (exista == true) {
                                res.send({updated: true, url: fullUrl})
                            }
                            else
                                res.send({error:"0400", errorMessage: errors[0400]});
                        })
                    else {
                        res.send({error:"0401", errorMessage: errors[0401]});
                    }
                });
            }
            else {
                res.send({error:"0402", errorMessage: errors[0402]});
            }
        });
    }
    else {
        res.send({error:"0403", errorMessage: errors[0403]});
    }
}
//add a digitalCoin, need sname, opt lname and page
var POSTinROOT = function (req, res) {
    var sname = req.param('sname', "");
    var lname = req.param('lname', "");
    var page = req.param('page', "");
    res.contentType('application/json');
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (sname !== "" && sname !== null) {
        sname = sname.toUpperCase();
        existsRealCoinSname(sname, function (existaRealSname) {
            if (existaRealSname == false)
                dbDigitalCoins.addDigitalCoin(new dbDigitalCoins.DigitalCoin(sname, lname, page), function (exista) {
                    if (exista == true) {
                        if (fullUrl.endsWith("/"))
                            res.send({added: true, url: fullUrl + sname});
                        else
                            res.send({added: true, url: fullUrl + '/' + sname});
                    }
                    else
                        res.send({error:"0404", errorMessage: errors[0404]});
                })
            else {
                res.send({error:"0401", errorMessage: errors[0401]});
            }
        });
    }
    else {
        res.send({error:"0403", errorMessage: errors[0403]});
    }
}
//get a specified digitalCoin with req.params.nameDigital
var GETByName = function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.contentType('application/json');
    dbDigitalCoins.getDigitalCoin(req.params.nameDigital, function (coin) {
        if (coin != null) {
            if (fullUrl.endsWith("/")) {
                coin.urlApis = fullUrl + "apiTickers";
            } else {
                coin.urlApis = fullUrl + "/apiTickers";
            }

            res.send(coin);
        }
        else {
            res.send({error:"0402", errorMessage: errors[0402]});
        }
    });
}
//delete a specified digitalCOin
var DELETEByName = function (req, res) {
    res.contentType('application/json');
    var sname = req.params.nameDigital;
    dbApiTicker.deleteAllApiWithDigital(sname, function (apisDeleted) {
        dbDigitalCoins.deleteDigitalCoin(sname, function (digitalCoins) {
            if (digitalCoins == true)
                res.send({deleted: true});
            else {
                res.send({error:"0403", errorMessage: errors[0403]});
            }
        });
    });
}
//check if a digitalCoin is unique, non-restful
var UniqueName = function(req,res){
    res.contentType('application/json');
    var sname = req.param('name', "");
    if(sname!="" && sname!=null){
        sname = sname.toUpperCase();
        existsDigitalCoin(sname, function (exits) {
            if (exits == false) {
                existsRealCoinSname(sname, function (existaRealSname) {
                    if(existaRealSname==false){
                        res.send({unique:true});
                    }else{
                        res.send({unique:false});
                    }
                })
            }
            else{
                res.send({unique:false});
            }
        })
    }else{
        res.send({error:"true"});
    }
};
//without credentials
exports.POSTUniqueName=UniqueName;
exports.GETall = GETallDigitalCoin;
exports.GETByNameDigital = GETByName;
//with credentials
exports.POSTinROOT = function (req, res) {
    credential.verifyCredentials(req, res, POSTinROOT);
};
exports.PUTByNameDigital = function (req, res) {
    credential.verifyCredentials(req, res, PUTByName);
};
exports.DELETEByName = function (req, res) {
    credential.verifyCredentials(req, res, DELETEByName);
};