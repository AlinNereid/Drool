/**
 * Created by alin on 5/23/14.
 */
var token = require('./token');
var errors=require('../errors/errors');
errors=errors.errors;
//verify a token from db, if invalid response with error otherwise callback with req,res
var verifyCredentials = function (req, res, callback) {
    res.contentType('application/json');
    var tokenID = req.param('token', null);
    if (tokenID != null) {
        token.verifyToken(tokenID, function (verified) {
            if (verified == true) {
                callback(req, res);
            }
            else {
                res.send({error: "0300", errorMessage: errors[0300]});
            }
        })

    } else {
        res.send({error: "0301", errorMessage: errors[0301]});
    }
}
exports.verifyCredentials = verifyCredentials;