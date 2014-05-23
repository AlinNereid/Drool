/**
 * Created by alin on 5/23/14.
 */
var token = require('./token');
var verifyCredentials = function (req, res, callback) {
    res.contentType('application/json');
    var tokenID = req.param('token', null);
    if (tokenID != null) {
        token.verifyToken(tokenID, function (verified) {
            if (verified == true) {
                callback(req, res);
            }
            else {
                res.send({error: "token invalid"});
            }
        })

    } else {
        res.send({error: "token inexistent"});
    }
}
exports.verifyCredentials = verifyCredentials;