/**
 * Created by alin on 5/26/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbRealCoins = require('../models/dbRealCoins');
var dbAPITicker = require('../models/dbAPITicker');
var convertorEngine = require('../parser+requestAPI+convertor/convertor');
convertorEngine.convert(3, "LTC", null, "RON", null, function (value) {
    console.log("VALOARE          " + value);
});
var get = function (req, res) {
    var digCoins = [];
    var rCoins = [];
    var apisR= [];
    var apiVal=[];
    var existUSD = false;
    var existRON = false;
    var existEUR = false;
    var exist = false;
    dbDigitalCoins.getAllDigitalCoins(function (digitalCoins) {
        for (i = 0; i < digitalCoins.length; i++) {
            if (i > 0)
                break;
            digCoins.push(digitalCoins[i].sname);
        }
        dbAPITicker.getAllApisWithDigSname(digCoins[0], function(apis){
            for (i = 0; i < apis.length; i++) {
                apisR.push(apis[i].sname);
                if (i >=1)
                    break;
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
                        res.render('rates', { title: 'Drool',  apis: apisR, digitalCoins: digCoins, realCoins: ['USD', 'EUR', 'RON']});
                        exist = true;
                        break;
                    }
                    if (i <= 2) {
                        rCoins.push(realCoins[i].symbol);
                    }
                }
                if (exist == false) {
                    res.render('rates', { title: 'Drool',  apis: apisR,  digitalCoins: digCoins, realCoins: rCoins,  apis: apisR});
                }
            })
        })

    })

};

exports.get=get;
