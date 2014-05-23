/**
 * Created by alin on 5/23/14.
 */
var database = require('../models/database.js');
var dbAPITicker = require('../models/dbAPITicker');
var getDate = function (nameApi, send_json, lastDate, numar, delay, callback) {
    if (numar != 0) {
        database.getDatabase().collection(nameApi).find({date: {$lt: lastDate - delay}}, {_id: 0}).sort({date: -1}).limit(1).toArray(function (err, results) {
            if (results != null) {
                try {
                    lastDate = results[0].date;
                    send_json["date"].push(results[0]);
                    numar = numar - 1;
                    getDate(nameApi, send_json, lastDate, numar, delay, callback);
                }
                catch (e) {
                    console.log("Error " + e)
                    callback(send_json);
                }
            } else {
                callback(send_json);
            }
        });
    } else {
        callback(send_json)
    }
}
var GETValues = function (req, res) {
    res.contentType('application/json');
    var hours = req.param('hours', "");
    var numberPoints = req.param('numberPoints', "");
    if (hours !== "" && hours !== null &&
        numberPoints !== "" && numberPoints !== null) {
        if (req.params.nameApi && req.params.nameDigital) {
            dbAPITicker.getApiTicker(req.params.nameApi, function (api) {
                if (api) {
                    if (api.digsname == req.params.nameDigital) {
                        hours = parseFloat(hours);
                        numar = parseInt(numberPoints);
                        if (!isNaN(hours) && !isNaN(numar)) {
                            if (hours >= 0 && numar >= 0) {
                                var delay = hours * 3600000 / numar;
                                var send_json = {};
                                var lastDate;
                                if (numar > 0) {
                                    database.getDatabase().collection(req.params.nameApi).find({}, {_id: 0}).sort({date: -1}).limit(1).toArray(function (err, results) {
                                        numar = numar - 1;
                                        send_json["date"] = [];
                                        send_json["date"].push(results[0]);
                                        lastDate = results[0].date;
                                        if (numar > 0) {
                                            getDate(req.params.nameApi, send_json, lastDate, numar, delay, function (send_json) {
                                                res.send(send_json);
                                            })
                                        } else {
                                            res.send(send_json);
                                        }

                                    })
                                } else {
                                    res.send({date:[]});
                                }
                            } else {
                                res.send({error: "need positive numbers"});
                            }
                        } else {
                            res.send({error: "need numbers"});
                        }
                    } else {
                        res.send({error: "Api nu corespunde bitcoinului"});
                    }
                } else {
                    res.send({error: "Date invalide"});
                }
            });
        } else {
            res.send({error: "Date invalide"});
        }
    } else {
        res.send({error: "Date invalide"});
    }
};
exports.GETValues = GETValues;