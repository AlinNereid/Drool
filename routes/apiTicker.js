/**
 * Created by alin on 5/17/14.
 */
var parser = require('../parser+requestAPI+convertor/parse');
var dbAPITicker = require('../models/dbAPITicker');
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbRealCoins = require('../models/dbRealCoins');
var digitalCoins = require('../parser+requestAPI+convertor/digitalCoins');
var intervalRequests = require('../parser+requestAPI+convertor/intervalRequests');
var admin = require("./admin");
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

var existsRealCoin = function (realsname, callback) {
    dbRealCoins.getAllRealSymbolCoins(function (symbols) {
        for (i = 0; i < symbols.length; i++) {
            if (realsname == symbols[i].symbol) {

                callback(true);
                break;
            }
        }
        if (i == symbols.length) {
            callback(false);
        }

    });
}

var verificaParsareSiCampuriURL = function (urlTicker, last, bid, avg_24h, volume, callback) {
    var dateParsate = parser.parseUrl(urlTicker, function (dateParsate) {
        var ok_last = false;
        var ok_bid = false;
        var ok_avg_24h = false;
        var ok_volume = false;
        if (dateParsate == false) {
            callback(false);
        }
        else {
            for (key in dateParsate) {
                if (last == key) {
                    ok_last = true;
                }

                if (bid == key) {
                    ok_bid = true;
                }

                if (avg_24h == key) {
                    ok_avg_24h = true;
                }

                if (volume == key) {
                    ok_volume = true;
                }

            }
            if (bid == "") {
                ok_bid = true;
                ;
            }
            if (avg_24h == "") {
                ok_avg_24h = true;

            }
            if (volume == "") {
                ok_volume = true;
            }
            if (ok_last == true && ok_bid == true && ok_avg_24h == true && ok_volume == true) {
                callback(true);
            }
            else {
                callback(false);
            }
        }

    });

}

var show = function (res, err, digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime) {
    dbDigitalCoins.getAllDigitalSNameCoins(function (snames) {
        dbRealCoins.getAllRealSymbolCoins(function (symbols) {
            res.render('addApi', {error: err, title: 'Drool Admin', sname: sname, urlTicker: urlTicker,
                digsname: digsname, realsname: realsname, last: last, requestTime: requestTime, bid: bid, avg_24h: avg_24h, volume: volume,
                snames: snames, symbols: symbols
            });
        })
    });
}
var showUpdate = function (res, err, digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime) {
    dbDigitalCoins.getAllDigitalSNameCoins(function (snames) {
        dbRealCoins.getAllRealSymbolCoins(function (symbols) {
            res.render('updateApi', {error: err, title: 'Drool Admin', sname: sname, urlTicker: urlTicker,
                digsname: digsname, realsname: realsname, last: last, requestTime: requestTime, bid: bid, avg_24h: avg_24h, volume: volume,
                snames: snames, symbols: symbols
            });
        })
    });
}

var postPageDigital = function (req, res) {
    var sname = req.param('sname', null);
    var urlTicker = req.param('urlTicker', null);
    var digsname = req.param('digsname', null);
    var realsname = req.param('realsname', null);
    var last = req.param('last', null);
    var requestTime = req.param('requestTime', null);

    var bid = req.param('bid', null);
    var avg_24h = req.param('avg_24h', null);
    var volume = req.param('volume', null);
    if (sname !== "" && sname !== null &&
        urlTicker !== "" && urlTicker !== null &&
        digsname !== "" && digsname !== null &&
        realsname !== "" && realsname !== null &&
        last !== "" && last !== null &&
        requestTime !== "" && requestTime !== null) {
        if (requestTime >= 5000) {
            if (sname != "Any api") {
                existsDigitalCoin(digsname, function (existsDigital) {
                    if (existsDigital == true) {
                        existsRealCoin(realsname, function (existsReal) {
                            if (existsReal == true) {
                                verificaParsareSiCampuriURL(urlTicker, last, bid, avg_24h, volume, function (okParsare) {
                                    if (okParsare == true) {
                                        dbAPITicker.addApiTicker(new dbAPITicker.ApiTicker(sname, urlTicker, digsname, realsname, last, requestTime, bid, avg_24h, volume), function (okData) {
                                            if (okData == true) {
                                                res.redirect(req.protocol + '://' + req.get('host') + "/controlpanel/showApis");
                                                digitalCoins.getCurrency(sname);
                                                intervalRequests.addInterval(sname, requestTime);
                                            }
                                            else {
                                                show(res, "Name already exits in the database", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
                                            }
                                        });
                                    }
                                    else {
                                        show(res, "The URL or the fields of the ticker are incorrect", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
                                    }
                                });
                            }
                            else {
                                show(res, "Real coin does not exist", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
                            }
                        });
                    }
                    else {

                        show(res, "Digital coin does not exist", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);

                    }
                })
            } else {
                show(res, "The name of the api can't be 'Any api'", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
            }
        }
        else {
            show(res, "The value of the request time is too low", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
        }
    }
    else {
        show(res, "Required fields are not filled", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);

    }
};
var getUpdateApiPage = function (req, res) {
    var name = req.params.name;
    if (name !== "" && name !== null) {
        dbAPITicker.getApiTicker(name, function (api) {
            if (api !== "" && api !== null) {
                dbDigitalCoins.getAllDigitalSNameCoins(function (snames) {
                    dbRealCoins.getAllRealSymbolCoins(function (symbols) {
                        showUpdate(res, "", api.digsname, api.sname, api.realsname, api.urlTicker, api.last,
                            api.bid, api.volume, api.avg_24h, api.requestTime)
                    })
                });
            } else {
                res.send("Error");
            }
        })
    }
}
var postUpdatePage = function (req, res) {
    var sname = req.param('sname', null);
    var urlTicker = req.param('urlTicker', null);
    var digsname = req.param('digsname', null);
    var realsname = req.param('realsname', null);
    var last = req.param('last', null);
    var requestTime = req.param('requestTime', null);

    var bid = req.param('bid', null);
    var avg_24h = req.param('avg_24h', null);
    var volume = req.param('volume', null);
    if (sname !== "" && sname !== null &&
        urlTicker !== "" && urlTicker !== null &&
        digsname !== "" && digsname !== null &&
        realsname !== "" && realsname !== null &&
        last !== "" && last !== null &&
        requestTime !== "" && requestTime !== null) {
        if (requestTime >= 5000) {
            dbAPITicker.getApiTicker(sname, function (api) {
                if (api) {
                    existsDigitalCoin(digsname, function (existsDigital) {
                        if (existsDigital == true) {
                            existsRealCoin(realsname, function (existsReal) {
                                if (existsReal == true) {
                                    verificaParsareSiCampuriURL(urlTicker, last, bid, avg_24h, volume, function (okParsare) {
                                        if (okParsare == true) {
                                            dbAPITicker.updateApi(new dbAPITicker.ApiTicker(sname, urlTicker, digsname, realsname, last, requestTime, bid, avg_24h, volume), function (okData) {
                                                if (okData == true) {
                                                    res.redirect(req.protocol + '://' + req.get('host') + "/controlpanel/showApis");
                                                    digitalCoins.getCurrency(sname);
                                                    intervalRequests.removeInterval(sname);
                                                    intervalRequests.addInterval(sname, requestTime);
                                                }
                                                else {
                                                    showUpdate(res, "Error updating api", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
                                                }
                                            });
                                        }
                                        else {
                                            showUpdate(res, "The URL or the fields of the ticker are incorrect", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
                                        }
                                    });
                                }
                                else {
                                    showUpdate(res, "Real coin does not exist", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
                                }
                            });
                        }
                        else {

                            showUpdate(res, "Digital coin does not exist", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);

                        }
                    })
                } else {
                    showUpdate(res, "Api does not exist", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
                }
            });
        }
        else {
            showUpdate(res, "The value of the request time is too low", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);
        }
    }
    else {
        showUpdate(res, "Required fields are not filled", digsname, sname, realsname, urlTicker, last, bid, volume, avg_24h, requestTime);

    }
}
var getAddApiPage = function (req, res) {
    dbDigitalCoins.getAllDigitalSNameCoins(function (snames) {
        dbRealCoins.getAllRealSymbolCoins(function (symbols) {
            res.render('addApi', {error: "", title: 'Drool Admin', sname: "", urlTicker: "",
                digsname: "", realsname: "", last: "", requestTime: "", bid: "", avg_24h: "", volume: "",
                snames: snames, symbols: symbols
            });
        })
    });

};
var getPageShowApis = function (req, res) {
    dbAPITicker.getAllApis(function (apis) {
        if (req.session.token) {
            var tokenID = req.session.token;
            if (tokenID != "")
                res.render('showApis', {title: 'Apis ', apis: apis, tokenID: tokenID});
            else
                res.render('showApis', {title: 'Apis ', apis: apis, tokenID: "invalid"});
        }
        else {
            res.render('showApis', {title: 'Apis ', apis: apis, tokenID: "invalid"});
        }

    });
};
var postDeleteApiPage = function (req, res) {
    var sname = req.params.name;
    if (sname !== "" && sname !== null) {
        intervalRequests.removeInterval(sname);
        dbAPITicker.deleteApi(sname, function (api) {
            if (api !== "" && api !== null)
                res.send(api);
            else {
                res.send("Error");
            }
        });
    }
}

exports.postPageDigital = function (req, res) {
    admin.verifyCredentials(req, res, postPageDigital);
};
exports.getUpdateApiPage = function (req, res) {
    admin.verifyCredentials(req, res, getUpdateApiPage);
};
exports.postUpdatePage = function (req, res) {
    admin.verifyCredentials(req, res, postUpdatePage);
};
exports.getAddApiPage = function (req, res) {
    admin.verifyCredentials(req, res, getAddApiPage);
};
exports.getPageShowApis = function (req, res) {
    admin.verifyCredentials(req, res, getPageShowApis);
};
exports.postDeleteApiPage = function (req, res) {
    admin.verifyCredentials(req, res, postDeleteApiPage);
};
