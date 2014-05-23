/**
 * Created by alin on 5/22/14.
 */
var convertorEngine = require('../parser+requestAPI+convertor/convertor');
exports.convertAPI = function (req, res) {
    var val1 = req.param('value', null);
    var c1 = req.param('currency1', null);
    var c2 = req.param('currency2', null);
    var api1 = req.param('api1', null);
    var api2 = req.param('api2', null);
    res.contentType('application/json');
    if (val1 != null && c1 != null && c2 != null)
        convertorEngine.convert(val1, c1, api1, c2, api2, function (value) {
            if (typeof value == "number" && !isNaN(value)) {
                res.send({value: value});
            } else {
                res.send({error: "currencies or apis doesn't exist or match", urlDocumentation: "\\blabla"});
            }
        });
    else {
        res.send({error: "insufficient data", urlDocumentation: "\\blabla"});
    }
};
