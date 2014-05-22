/**
 * Created by alin on 5/21/14.
 */
var dbAPITicker = require('../models/dbAPITicker');
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbRealCoins = require('../models/dbRealCoins');

var currency1 = "BTC";
var val1 = 2;
var currency2 = "RON";

var getLowerValueInUSD = function (val, currency, callback) {
    //console.log("getLowerValue");
    dbAPITicker.getAllApisWithDigSname(currency, function (apis) {
        var numApis = apis.length;
        var apiCurentID = 0;
        var lowerValue;
        if (apis.length > 0) {
            apis.forEach(function (api) {
                dbAPITicker.getLastValue(api.sname, function (value) {
                    var currentValue = {};
                    currentValue.value = value.last;
                    currentValue.ref = api.realsname;
                    changeValueToUSD(currentValue, function (priceInUSD) {
                        apiCurentID++;
                        console.log(priceInUSD);
                        if (typeof lowerValue == "undefined") {
                            lowerValue = val * priceInUSD;
                        }
                        else {
                            if (lowerValue > val * priceInUSD) {
                                lowerValue = val * priceInUSD;
                            }
                        }
                        if (apiCurentID == numApis) {
                            callback(lowerValue);
                        }
                    });
                });
            })
        } else {
            callback("Error - nu exista api pentru currency");
        }

    });
};
var getValueInUSDReal = function (realName, callback) {
    dbRealCoins.getValue(realName, function (value) {
        if (value == null) {
            callback("ERROR + nu exista moneda reala");
        } else
            callback(value.price);
    });
}
var getValueInUSD = function (val, currency, nameApi, callback) {
    dbAPITicker.getApiTicker(nameApi, function (api) {
        if (api != null) {
            if (api.digsname == currency) {
                dbAPITicker.getLastValue(nameApi, function (value) {
                    var currentValue = {};
                    currentValue.value = value.last;
                    currentValue.ref = api.realsname;
                    changeValueToUSD(currentValue, function (priceInUSD) {
                        callback(priceInUSD * val);
                    });
                });
            } else {
                callback("Eroare, currency gresit");
            }
        } else {
            callback("Eroare, api inexistent");
        }
    });
};
var changeValueToUSD = function (currency, callback) {
    dbRealCoins.getValue(currency.ref, function (valueInUSD) {
        var priceInUSD = currency.value / valueInUSD.price;
        callback(priceInUSD);
    })
};
var getTypeCurrency = function (name, callback) {
    dbDigitalCoins.getDigitalCoin(name, function (digitalCoin) {
        if (digitalCoin != null)
            callback("digital");
        else {
            dbRealCoins.getValue(name, function (realValue) {
                if (realValue != null)
                    callback("real");
                else
                    callback("");
            })
        }
    });
};
var convert = function (val1, currency1, api1, currency2, api2, callback) {
    var coef=val1;
    val1=1;
    val2=1;
    var tip1, tip2;
    var value;
    getTypeCurrency(currency1, function (type) {
        tip1 = type;
        getTypeCurrency(currency2, function (type) {
            tip2 = type;
            //console.log(tip1 + "    " + tip2);
            if (tip1 == "" || tip2 == "") {
                callback("ERROR");
            } else if (api1 == null && api2 == null) //nu se specifica niciun API
            {
                if (tip1 == "digital") {
                    getLowerValueInUSD(val1, currency1, function (lowerInUsdVal1) {
                        if (tip2 == "digital") {
                            console.log("DD");
                            getLowerValueInUSD(val2, currency2, function (lowerInUsdVal2) {
                                value = lowerInUsdVal1 / lowerInUsdVal2;
                                callback(value*coef);
                            });
                        } else {
                            console.log("DR");
                            getValueInUSDReal(currency2, function (valueInUSD2) {
                                valueInUSD2 = valueInUSD2 * val2;
                                console.log(lowerInUsdVal1 + "        " + valueInUSD2);
                                value = lowerInUsdVal1 * valueInUSD2;
                                callback(value*coef);
                            });
                        }
                    });
                } else {
                    getValueInUSDReal(currency1, function (valueInUSD1) {
                        valueInUSD1 = valueInUSD1 * val1;
                        if (tip2 == "digital") {
                            console.log("RD");
                            getLowerValueInUSD(val2, currency2, function (lowerInUsdVal2) {
                                value = 1 / (valueInUSD1 * lowerInUsdVal2);
                                callback(value*coef);
                            });
                        } else {
                            console.log("RR");
                            getValueInUSDReal(currency2, function (valueInUSD2) {
                                valueInUSD2=valueInUSD2*val2;
                                value = valueInUSD2 / valueInUSD1;
                                callback(value*coef);
                            });
                        }
                    });
                }
            } else if (api1 != null && api2 != null) // se specifica ambele api'uri
            {
                if (tip1 == "digital" && tip2 == "digital") {
                    console.log("DD");
                    getValueInUSD(val1, currency1, api1, function (valueInUSD1) {
                        getValueInUSD(val2, currency2, api2, function (valueInUSD2) {
                            value = valueInUSD1 / valueInUSD2;
                            callback(value*coef);
                        })
                    })
                } else {
                    callback("error, types must be digital");
                }
            } else if (api1 != null && api2 == null) {//se specifica doar primul api
                if (tip1 == "digital") {
                    getValueInUSD(val1, currency1, api1, function (valueInUSD1) {
                        if (tip2 == "digital") {
                            console.log("DD");
                            getLowerValueInUSD(val2, currency2, function (lowerInUsdVal2) {
                                value = valueInUSD1 / lowerInUsdVal2;
                                callback(value*coef);
                            });
                        } else {
                            console.log("DR");
                            getValueInUSDReal(currency2, function (valueInUSD2) {
                                valueInUSD2 = valueInUSD2 * val2;
                                value = valueInUSD1 * valueInUSD2;
                                callback(value*coef);
                            });
                        }
                    });
                } else {
                    callback("error, types must be digital");
                }
            } else if (api1 == null && api2 != null) {
                if (tip2 == "digital") {
                    getValueInUSD(val2, currency2, api2, function (valueInUSD2) {
                        if (tip1 == "digital") {
                            console.log("DD");
                            getLowerValueInUSD(val1, currency1, function (lowerInUsdVal1) {
                                value = lowerInUsdVal1 / valueInUSD2;
                                callback(value*coef);
                            });
                        } else {
                            console.log("RD");
                            getValueInUSDReal(currency1, function (valueInUSD1) {
                                valueInUSD1 = valueInUSD1 * val1;
                                value = 1 / (valueInUSD1 * valueInUSD2);
                                callback(value*coef);
                            });
                        }
                    });
                } else {
                    callback("error, types must be digital");
                }
            }
        })
    });
};
exports.convert = convert;