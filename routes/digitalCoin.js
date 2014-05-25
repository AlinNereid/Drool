/**
 * Created by alin on 5/17/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbApiTicker = require('../models/dbAPITicker');
var dbRealCoins = require('../models/dbRealCoins');
var admin=require("./admin");
//db.digitalCoins.ensureIndex( { sname: 1 }, { unique: true } )
var getPageAddDigital = function (req, res) {
    res.render('addDigitalCoin', {error: "", title: 'Drool Admin', sname: "", lname: "", page: ""});
};
var getPageShowDigital = function (req, res) {
    dbDigitalCoins.getAllDigitalCoins(function (digitalCoins) {
        if(req.session.token){
            var tokenID=req.session.token;
            if(tokenID!=""){
                res.render('showDigitalCoins', {title: 'Digital Coins', digitalCoins: digitalCoins, tokenID:tokenID});
            }
            else{
                res.render('showDigitalCoins', {title: 'Digital Coins', digitalCoins: digitalCoins, tokenID:"invalid"});
            }
        }
        else{
            res.render('showDigitalCoins', {title: 'Digital Coins', digitalCoins: digitalCoins, tokenID:"invalid"});
        }
    });
};
var getPageUpdateDigital = function (req, res) {
    var sname = req.params.name;
    if (sname !== "" && sname !== null) {
        dbDigitalCoins.getDigitalCoin(sname, function (digitalCoins) {
            if (digitalCoins !== "" && digitalCoins !== null)
                res.render('updateDigitalCoin', {error: "", title: 'Update Digital Coin', sname: digitalCoins.sname, lname: digitalCoins.lname, page: digitalCoins.page});
            else {
                res.send("Error updating digital coin");
            }
        });
    }

};
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
var postPageDigital = function (req, res) {
    var sname = req.param('sname', null);
    var lname = req.param('lname', null);
    var page = req.param('page', null);

    if (sname !== "" && sname !== null) {
        sname = sname.toUpperCase();
        existsRealCoinSname(sname, function (existaRealSname) {
            if (existaRealSname == false)
                dbDigitalCoins.addDigitalCoin(new dbDigitalCoins.DigitalCoin(sname, lname, page), function (exista) {
                    if (exista == true) {
                        res.redirect(req.protocol+'://'+req.get('host')+"/controlpanel/showDigitalCoins");
                    }
                    else
                        res.render('addDigitalCoin', {error: "Digital coin exists in the database", title: 'Drool Admin', sname: sname, lname: lname, page: page});
                })
            else {
                res.render('addDigitalCoin', {error: "Exists a real coin with the same name", title: 'Drool Admin', sname: sname, lname: lname, page: page});
            }
        });
    }
    else {
        res.render('addDigitalCoin', {error: "Required fields are not filled", title: 'Drool Admin', sname: sname, lname: lname, page: page});
    }
};
var postPageUpdateDigital = function (req, res) {
    var sname = req.param('sname', null);
    var lname = req.param('lname', null);
    var page = req.param('page', null);
    if (sname !== "" && sname !== null) {
        sname = sname.toUpperCase();
        existsDigitalCoin(sname, function (exits) {
            if (exits == true) {
                existsRealCoinSname(sname, function (existaRealSname) {
                    if (existaRealSname == false)
                        dbDigitalCoins.updateDigitalCoin(new dbDigitalCoins.DigitalCoin(sname, lname, page), function (exista) {
                            if (exista == true) {
                                res.redirect(req.protocol+'://'+req.get('host')+"/controlpanel/showDigitalCoins");
                            }
                            else
                                res.render('updateDigitalCoin', {error: "Error in updating digital coin", title: 'Drool Admin', sname: sname, lname: lname, page: page});
                        })
                    else {
                        res.render('updateDigitalCoin', {error: "Exists a real coin with the same name", title: 'Drool Admin', sname: sname, lname: lname, page: page});
                    }
                });
            }
            else {
                res.send("Digital coin does not exist");
            }
        });
    }
    else {
        res.render('updateDigitalCoin', {error: "Invalid data", title: 'Drool Admin', sname: sname, lname: lname, page: page});
    }
}
var postDeletePage = function (req, res) {
    var sname = req.params.name;
    if (sname !== "" && sname !== null) {
        dbApiTicker.deleteAllApiWithDigital(sname, function (apisDeleted) {
            if (apisDeleted == true) {
                //console.log("am sters si api'uri");
            }
            dbDigitalCoins.deleteDigitalCoin(sname, function (digitalCoins) {
                if (digitalCoins == true)
                    res.send(digitalCoins);
                else {
                    res.send("Invalid Data");
                }
            });
        });

    }
}

exports.getPageAddDigital=function(req,res){
    admin.verifyCredentials(req,res, getPageAddDigital);
};
exports.getPageShowDigital=function(req,res){
    admin.verifyCredentials(req,res, getPageShowDigital);
};
exports.getPageUpdateDigital=function(req,res){
    admin.verifyCredentials(req,res, getPageUpdateDigital);
};
exports.postPageDigital=function(req,res){
    admin.verifyCredentials(req,res, postPageDigital);
};
exports.postPageUpdateDigital=function(req,res){
    admin.verifyCredentials(req,res, postPageUpdateDigital);
};
exports.postDeletePage=function(req,res){
    admin.verifyCredentials(req,res, postDeletePage);
};


