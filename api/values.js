/**
 * Created by alin on 5/23/14.
 */
var database = require('../models/database.js');
var dbAPITicker = require('../models/dbAPITicker');
var errors = require('../errors/errors');
errors = errors.errors;
//get values for an api recursive with a number of points, and delay
var getDate = function (nameApi, send_json, lastDate, numar, delay, maxTime, callback) {
    if (numar != 1) {
        database.getDatabase().collection(nameApi).find({date: {$lt: lastDate - delay}}, {_id: 0}).sort({date: -1}).limit(1).toArray(function (err, results) {
            if (results != null) {
                try {
                    lastDate = results[0].date;
                    if (lastDate > maxTime) {
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
//get values for an api, with hours, numberPoins, and opt startTime
var GETValues = function (req, res) {
    res.contentType('application/json');
    var hours = req.param('hours', "");
    var numberPoints = req.param('numberPoints', "");
    var startTime = req.param('startTime', "");
    if (hours !== "" && hours !== null &&
        numberPoints !== "" && numberPoints !== null) {
        if (startTime != null && startTime != "") {
            startTime = parseInt(startTime);
        } else {
            startTime = Date.now();
        }
        if (!isNaN(startTime)) {
            if (numberPoints <= maxNumPoints) {
                if (req.params.nameApi && req.params.nameDigital) {
                    dbAPITicker.getApiTicker(req.params.nameApi, function (api) {
                        if (api) {
                            if (api.digsname == req.params.nameDigital) {
                                hours = parseFloat(hours);
                                numar = parseInt(numberPoints);
                                if (!isNaN(hours) && !isNaN(numar)) {
                                    if (hours >= 0 && numar >= 0) {
                                        if(startTime>Date.now()){
                                            startTime=Date.now();
                                        }
                                        var maxTime = startTime - hours * 3600000;
                                        numar = numar + 1;
                                        var delay = hours * 3600000 / numar - api.requestTime;
                                        if (delay <= 0) {
                                            delay = 1;
                                        }
                                        //console.log("delay "+ delay);
                                        var send_json = {};
                                        var lastDate = startTime;
                                        console.log(lastDate);
                                        if (numar > 0) {
                                            database.getDatabase().collection(req.params.nameApi).find({date: {$lt: lastDate}}, {_id: 0}).sort({date: -1}).limit(1).toArray(function (err, results) {
                                                numar = numar - 1;
                                                send_json["date"] = [];
                                                if (results.length>0) {
                                                    send_json["date"].push(results[0]);
                                                    lastDate = results[0].date;
                                                    if (numar > 0) {
                                                        getDate(req.params.nameApi, send_json, lastDate, numar, delay, maxTime, function (send_json) {
                                                            res.send(send_json);
                                                        })
                                                    } else {
                                                        res.send(send_json);
                                                    }

                                                } else {
                                                    res.send(send_json);
                                                }

                                            })
                                        } else {
                                            res.send({date: []});
                                        }
                                    } else {
                                        res.send({error: "0600", errorMessage: errors[0600]});
                                    }
                                } else {
                                    res.send({error: "0601", errorMessage: errors[0601]});
                                }
                            } else {
                                res.send({error: "0100", errorMessage: errors[0100]});
                            }
                        } else {
                            res.send({error: "0602", errorMessage: errors[0602]});
                        }
                    });
                } else {
                    res.send({error: "0602", errorMessage: errors[0602]});
                }
            } else {
                res.send({error: "0603", errorMessage: errors[0603]});
            }
        } else {
            res.send({error: "0604", errorMessage: errors[0604]});
        }
    } else {
        res.send({error: "0602", errorMessage: errors[0602]});
    }

};
exports.GETValues = GETValues;