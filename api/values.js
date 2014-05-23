/**
 * Created by alin on 5/23/14.
 */
var database = require('../models/database.js');
var dbAPITicker = require('../models/dbAPITicker');
var getDate = function (nameApi, send_json, lastDate, numar, delay,maxTime, callback) {
    if (numar != 1) {
        database.getDatabase().collection(nameApi).find({date: {$lt: lastDate - delay}}, {_id: 0}).sort({date: -1}).limit(1).toArray(function (err, results) {
            if (results != null) {
                try {
                    console.log(lastDate)
                    lastDate = results[0].date;
                    if (lastDate > maxTime) {
                        console.log(lastDate + ">" + maxTime)
                        send_json["date"].push(results[0]);
                        numar = numar - 1;
                        getDate(nameApi, send_json, lastDate, numar, delay, maxTime, callback);

                    } else {
                        console.log("Range exceed");
                        callback(send_json);
                    }
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
var maxNumPoints = 50;
var GETValues = function (req, res) {
    res.contentType('application/json');
    var hours = req.param('hours', "");
    var numberPoints = req.param('numberPoints', "");
    if (hours !== "" && hours !== null &&
        numberPoints !== "" && numberPoints !== null) {
        if (numberPoints <= maxNumPoints) {
            if (req.params.nameApi && req.params.nameDigital) {
                dbAPITicker.getApiTicker(req.params.nameApi, function (api) {
                    if (api) {
                        if (api.digsname == req.params.nameDigital) {
                            hours = parseFloat(hours);
                            numar = parseInt(numberPoints);
                            if (!isNaN(hours) && !isNaN(numar)) {
                                if (hours >= 0 && numar >= 0) {
                                    var maxTime = Date.now() - hours * 3600000;
                                    numar = numar + 1;
                                    var delay = hours * 3600000 / numar - api.requestTime * numar;
                                    if (delay <= 0) {
                                        delay = 1;
                                    }
                                    console.log("delay "+ delay);
                                    var send_json = {};
                                    var lastDate;
                                    if (numar > 0) {
                                        database.getDatabase().collection(req.params.nameApi).find({}, {_id: 0}).sort({date: -1}).limit(1).toArray(function (err, results) {
                                            numar = numar - 1;
                                            send_json["date"] = [];
                                            send_json["date"].push(results[0]);
                                            lastDate = results[0].date;
                                            if (numar > 0) {
                                                getDate(req.params.nameApi, send_json, lastDate, numar, delay, maxTime, function (send_json) {
                                                    res.send(send_json);
                                                })
                                            } else {
                                                res.send(send_json);
                                            }

                                        })
                                    } else {
                                        res.send({date: []});
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
            res.send({error: "numarul de puncte mai mic ca  max"});
        }
    } else {
        res.send({error: "Date invalide"});
    }
};
exports.GETValues = GETValues;