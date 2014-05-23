/**
 * Created by alin on 5/22/14.
 */
var parser = require('../parser+requestAPI+convertor/parse');
var dbAPITicker = require('../models/dbAPITicker');
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbRealCoins = require('../models/dbRealCoins');
var digitalCoins = require('../parser+requestAPI+convertor/digitalCoins');
var intervalRequests = require('../parser+requestAPI+convertor/intervalRequests');
var credential = require('../api/credentials');
String.prototype.endsWith = function (suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
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
var GETallApiWithDigital = function (req, res) {
    res.contentType('application/json');
    dbAPITicker.getAllApisWithDigSname(req.params.nameDigital, function (apis) {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        for (i = 0; i < apis.length; i++) {
            if (fullUrl.endsWith("/"))
                apis[i].url = fullUrl + apis[i].sname;
            else
                apis[i].url = fullUrl + '/' + apis[i].sname;
        }
        res.send(apis);
    });
}
var GETApiWithDigital = function (req, res) {
    res.contentType('application/json');
    dbAPITicker.getApiTicker(req.params.nameApi, function (api) {
        if (api) {
            if (api.digsname == req.params.nameDigital) {
                if (api != null) {
                    res.send(api);
                } else {
                    res.send({error: "api invalid "});
                }
            } else {
                res.send({error: "api invalid "});
            }
        } else {
            res.send({error: "api invalid "});
        }
    })
}
var POSTinROOT = function (req, res) {
    res.contentType('application/json');
    var sname = req.param('sname', "");
    var urlTicker = req.param('urlTicker', "");
    var digsname = req.param('digsname', "");
    var realsname = req.param('realsname', "");
    var last = req.param('last', "");
    var requestTime = req.param('requestTime', "");

    var bid = req.param('bid', "");
    var avg_24h = req.param('avg_24h', "");
    var volume = req.param('volume', "");
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if (digsname == req.params.nameDigital &&
        sname !== "" && sname !== null &&
        urlTicker !== "" && urlTicker !== null &&
        digsname !== "" && digsname !== null &&
        realsname !== "" && realsname !== null &&
        last !== "" && last !== null &&
        requestTime !== "" && requestTime !== null) {
        if (requestTime >= 3) {
            existsDigitalCoin(digsname, function (existsDigital) {
                if (existsDigital == true) {
                    existsRealCoin(realsname, function (existsReal) {
                        if (existsReal == true) {
                            verificaParsareSiCampuriURL(urlTicker, last, bid, avg_24h, volume, function (okParsare) {
                                if (okParsare == true) {
                                    dbAPITicker.addApiTicker(new dbAPITicker.ApiTicker(sname, urlTicker, digsname, realsname, last, requestTime, bid, avg_24h, volume), function (okData) {
                                        if (okData == true) {
                                            res.send({added: true, url: fullUrl + '/' + sname})
                                            digitalCoins.getCurrency(sname);
                                            intervalRequests.addInterval(sname, requestTime);
                                        }
                                        else {
                                            res.send({error: "Name already in database+doc"});
                                        }
                                    });
                                }
                                else {
                                    res.send({error: "URL or ticker fields are incorrect"});
                                }
                            });
                        }
                        else {
                            res.send({error: "Real coin does not exist"});
                        }
                    });
                }
                else {
                    res.send({error: "Digitalcoin does not exist"});
                }
            })
        }
        else {
            res.send({error: "Request time is too low"});
        }
    }
    else {
        res.send({error: "Required fields are not filled+Doc"});

    }
}
var PUTByDigNameApiName = function (req, res) {
    res.contentType('application/json');
    var sname = req.param('sname', "");
    var urlTicker = req.param('urlTicker', "");
    var digsname = req.param('digsname', "");
    var realsname = req.param('realsname', "");
    var last = req.param('last', "");
    var requestTime = req.param('requestTime', "");

    var bid = req.param('bid', "");
    var avg_24h = req.param('avg_24h', "");
    var volume = req.param('volume', "");
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    if (sname == req.params.nameApi &&
        digsname == req.params.nameDigital &&
        sname !== "" && sname !== null &&
        urlTicker !== "" && urlTicker !== null &&
        digsname !== "" && digsname !== null &&
        realsname !== "" && realsname !== null &&
        last !== "" && last !== null &&
        requestTime !== "" && requestTime !== null) {
        if (requestTime >= 3) {
            dbAPITicker.getApiTicker(sname, function (api) {
                //console.log("PUT API "+api);
                if (api) {
                    if (api.digsname == req.params.nameDigital) {
                        existsDigitalCoin(digsname, function (existsDigital) {
                            if (existsDigital == true) {
                                existsRealCoin(realsname, function (existsReal) {
                                    if (existsReal == true) {
                                        verificaParsareSiCampuriURL(urlTicker, last, bid, avg_24h, volume, function (okParsare) {
                                            if (okParsare == true) {
                                                dbAPITicker.updateApi(new dbAPITicker.ApiTicker(sname, urlTicker, digsname, realsname, last, requestTime, bid, avg_24h, volume), function (okData) {
                                                    if (okData == true) {
                                                        res.send({updated: true,
                                                            url: fullUrl});
                                                        digitalCoins.getCurrency(sname);
                                                        intervalRequests.removeInterval(sname);
                                                        intervalRequests.addInterval(sname, requestTime);
                                                    }
                                                    else {
                                                        res.send({error: "Error update"});
                                                    }
                                                });
                                            }
                                            else {
                                                res.send({error: "URL or ticker fields are incorrect"});
                                            }
                                        });
                                    }
                                    else {
                                        res.send({error: "Real coin does not exist"});
                                    }
                                });
                            }
                            else {
                                res.send({error: "Digitalcoin does not exist"});

                            }
                        })
                    } else {
                        res.send({error: "api nu corespunde"});
                    }
                } else {
                    res.send({error: "Api doesn't exist"});
                }
            })
        }
        else {
            res.send({error: "Request time is too low"});
        }
    }
    else {
        res.send({error: "Required fields are not filled sau api + digcoin nu corespund"});
    }
};
var DELETEApi = function (req, res) {
    res.contentType('application/json');
    var sname = req.params.nameApi;
    dbAPITicker.getApiTicker(sname, function (api) {
        if (api) {
            if (api.digsname == req.params.nameDigital) {
                intervalRequests.removeInterval(sname);
                dbAPITicker.deleteApi(sname, function (api) {
                    if (api !== "" && api !== null)
                        res.send({deleted: true});
                    else {
                        res.send({error: "date invalide"});
                    }
                });
            } else {
                res.send({error: "date invalide"});
            }
        } else {
            res.send({error: "date invalide"});
        }
    });
}
exports.GETallApiWithDigital = GETallApiWithDigital;
exports.GETApiWithDigital = GETApiWithDigital;
exports.POSTinROOT = function (req, res) {
    credential.verifyCredentials(req, res, POSTinROOT);
};
;
exports.PUTByDigNameApiName = function (req, res) {
    credential.verifyCredentials(req, res, PUTByDigNameApiName);
};
;
exports.DELETEApi = function (req, res) {
    credential.verifyCredentials(req, res, DELETEApi);
};