/**
 * Created by alin on 5/23/14.
 */
var dbToken = require('../models/dbToken');
var crypto = require('crypto');
var getTokenID = function (hoursValability) {
    shasum = crypto.createHash('sha1');
    shasum.update(Date.now() + "password" + hoursValability);
    passSHA1 = shasum.digest('hex');
    return passSHA1;
}
var addNewToken = function (hoursValability, callback) {
    var TokenID = getTokenID(hoursValability);

    dbToken.addToken(new dbToken.Token(TokenID, 3600000 * hoursValability + Date.now()), function (added) {
        if (added) {
            callback(TokenID);
        } else {
            callback(false);
        }
    });
}
var verify = function (tokenID, callback) {
    dbToken.getToken(tokenID, function (token) {
        if (token) {
            if (token.expiryDate > Date.now())
                callback(true);
            else {
                dbToken.deleteToken(tokenID, function (deleted) {
                    callback(false);
                });
            }
        } else {
            callback(false);
        }
    })
}
exports.verifyToken = verify;
exports.addToken = addNewToken;