/**
 * Created by alin on 5/17/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbApiTicker = require('../models/dbAPITicker');
var dbRealCoins = require('../models/dbRealCoins');
//db.digitalCoins.ensureIndex( { sname: 1 }, { unique: true } )
exports.getPageAddDigital = function (req, res) {
    res.render('addDigitalCoin', {error: "", title: 'Drool Admin', sname: "", lname: "", page: ""});
};
exports.getPageShowDigital = function (req, res) {
    dbDigitalCoins.getAllDigitalCoins(function (digitalCoins) {
        res.render('showDigitalCoins', {title: 'Digital Coins', digitalCoins: digitalCoins});
    });
};
exports.getPageUpdateDigital = function (req, res) {
    var sname = req.params.name;
    if (sname !== "" && sname !== null) {
        dbDigitalCoins.getDigitalCoin(sname, function (digitalCoins) {
            if (digitalCoins !== "" && digitalCoins !== null)
                res.render('updateDigitalCoin', {error: "", title: 'Update Digital Coin', sname: digitalCoins.sname, lname: digitalCoins.lname, page: digitalCoins.page});
            else {
                res.send("date invalide");
            }
        });
    }

};
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
exports.postPageDigital = function (req, res) {
    var sname = req.param('sname', null);
    var lname = req.param('lname', null);
    var page = req.param('page', null);

    if (sname !== "" && sname !== null) {
        sname = sname.toUpperCase();
        existsRealCoinSname(sname, function (existaRealSname) {
            if (existaRealSname == false)
                dbDigitalCoins.addDigitalCoin(new dbDigitalCoins.DigitalCoin(sname, lname, page), function (exista) {
                    if (exista == true) {
                        res.send("Add in bd");
                    }
                    else
                        res.render('addDigitalCoin', {error: "Moneda exista in baza de date", title: 'Drool Admin', sname: sname, lname: lname, page: page});
                })
            else {
                res.render('addDigitalCoin', {error: "Exista moneda reala cu acest nume", title: 'Drool Admin', sname: sname, lname: lname, page: page});
            }
        });
    }
    else {
        res.render('addDigitalCoin', {error: "Date invalide", title: 'Drool Admin', sname: sname, lname: lname, page: page});
    }
};
exports.postPageUpdateDigital = function (req, res) {
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
                                res.send("Update in bd");
                            }
                            else
                                res.render('updateDigitalCoin', {error: "Moneda exista in baza de date", title: 'Drool Admin', sname: sname, lname: lname, page: page});
                        })
                    else {
                        res.render('updateDigitalCoin', {error: "Exista moneda reala cu acest nume", title: 'Drool Admin', sname: sname, lname: lname, page: page});
                    }
                });
            }
            else {
                res.send("Nu exista sname");
            }
        });
    }
    else {
        res.render('updateDigitalCoin', {error: "Date invalide", title: 'Drool Admin', sname: sname, lname: lname, page: page});
    }
}
exports.postDeletePage = function (req, res) {
    var sname = req.params.name;
    if (sname !== "" && sname !== null) {
        dbApiTicker.deleteAllApiWithDigital(sname, function (apisDeleted) {
            if (apisDeleted == true) {
                console.log("am sters si api'uri");
            }
            dbDigitalCoins.deleteDigitalCoin(sname, function (digitalCoins) {
                if (digitalCoins == true)
                    res.send(digitalCoins);
                else {
                    res.send("date invalide");
                }
            });
        });

    }
}