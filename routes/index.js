/*
 * GET home page.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbRealCoins = require('../models/dbRealCoins');
exports.get = function (req, res) {
    var digCoins = [];
    var rCoins = [];
    var existUSD = false;
    var existRON = false;
    var existEUR = false;
    var exist = false;
    dbDigitalCoins.getAllDigitalCoins(function (digitalCoins) {
        for (i = 0; i < digitalCoins.length; i++) {
            if (i > 2)
                break;
            digCoins.push(digitalCoins[i].sname);
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
                    res.render('index', { title: 'Drool', digitalCoins: digCoins, realCoins: ['USD', 'EUR', 'RON']});
                    exist = true;
                    break;
                }
                if (i <= 2) {
                    rCoins.push(realCoins[i].symbol);
                }
            }
            if (exist == false) {
                res.render('index', { title: 'Drool', digitalCoins: digCoins, realCoins: rCoins});
            }
        })
    })

};
