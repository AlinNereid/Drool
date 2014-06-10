/**
 * Created by alin on 5/22/14.
 */
var dbRealCoins = require('../models/dbRealCoins');
var errors=require('../errors/errors');
errors=errors.errors;
//get all realCoins
var GETallRealCoins = function (req, res) {
    res.contentType('application/json');
    dbRealCoins.getAllRealSymbolPriceCoins(function (realCoins) {
        var dateSend =
        {source: "http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json",
            refCurrency: "USD",
            realCoins: realCoins}
        res.send(dateSend);
    })
}
//get specified realCoin
var GETByName = function (req, res) {
    res.contentType('application/json');
    dbRealCoins.getValue(req.params.name, function (value) {
        if (value != null) {
            res.send({
                symbol: req.params.name,
                refCurrency: "USD",
                price: value.price
            });
        } else {
            res.send({error: "0500", errorMessage: errors[0500]});
        }
    })
}
exports.GETall = GETallRealCoins
exports.GETByName = GETByName