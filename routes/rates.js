/**
 * Created by alin on 5/26/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbRealCoins = require('../models/dbRealCoins');
var dbAPITicker = require('../models/dbAPITicker');
var convertorEngine = require('../parser+requestAPI+convertor/convertor');
/*convertorEngine.convert(3, "LTC", null, "RON", null, function (value) {
 console.log("VALOARE          " + value);
 });*/
var get = function (req, res) {
    var digCoins = [];
    var rCoins = [];
    var apisR = [];
    var apisSname = [];
    var getValuesRates= function(digCoins, valApi1, valApi2){
        var existUSD = false;
        var existRON = false;
        var existEUR = false;
        var exist = false;
        var apiVal = [];
        apiVal.push(valApi1);
        if(valApi2!=null){
            apiVal.push(valApi2);
        }
        dbRealCoins.getAllRealCoins(function (realCoins) {
            for (i = 0; i < realCoins.length; i++) {
                if (realCoins[i].symbol == "USD") {
                    existUSD = true;
                }
                if (realCoins[i].symbol == "RON") {
                    existRON = true;
                }
                if (realCoins[i].symbol == "EUR") {
                    existEUR = true;
                }
                if (existEUR && existUSD && existRON) {
                    convertorEngine.convert(1, digCoins[0], null, "USD", null, function (valUsd) {
                        convertorEngine.convert(1, digCoins[0], null, "EUR", null, function (valEur) {
                            convertorEngine.convert(1, digCoins[0], null, "RON", null, function (valRon) {
                                console.log("val usd " + valUsd + " val eur " + valEur + " val ron " + valRon);
                                res.render('rates', { title: 'Drool', apis: apisSname, digitalCoins: digCoins, realCoins: ['USD', 'EUR', 'RON'], usd: valUsd.toFixed(3), eur: valEur.toFixed(3), ron: valRon.toFixed(3), apisVal: apiVal});
                            });
                        });
                    });
                    /*                        res.render('rates', { title: 'Drool',  apis: apisR, digitalCoins: digCoins, realCoins: ['USD', 'EUR', 'RON']});*/
                    exist = true;
                    break;
                }
                if (i <= 2) {
                    rCoins.push(realCoins[i].symbol);
                }
            }
            if (exist == false) {
                res.render('rates', { title: 'Drool', apis: apisR, digitalCoins: digCoins, realCoins: rCoins, apis: apisR});
            }
        })
    }
    dbDigitalCoins.getAllDigitalCoins(function (digitalCoins) {
        for (i = 0; i < digitalCoins.length; i++) {
            if (i > 0)
                break;
            digCoins.push(digitalCoins[i].sname);
        }
        dbAPITicker.getAllApisWithDigSname(digCoins[0], function (apis) {
            for (i = 0; i < apis.length; i++) {
                apisR.push(apis[i]);
                apisSname.push(apis[i].sname);
                if (i >= 1)
                    break;
            }
            if(apisR.length==1){
                convertorEngine.convert(1, digCoins[0], apisR[0].sname, apisR[0].realsname, null, function (valApi1) {
                    getValuesRates(digCoins,valApi1, null);
                });
            } else{
                if(apisR.length==2){
                    convertorEngine.convert(1, digCoins[0], apisR[0].sname, apisR[0].realsname, null, function (valApi1) {
                        convertorEngine.convert(1, digCoins[0], apisR[1].sname, apisR[1].realsname, null, function (valApi2) {
                            getValuesRates(digCoins,valApi1, valApi2);
                        });
                    });
                }
            }

        })

    });
}
exports.get = get;
