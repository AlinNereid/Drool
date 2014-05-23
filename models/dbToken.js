/**
 * Created by alin on 5/23/14.
 */
var nameCollection = "Tokens"
var database = require('./database.js');
exports.Token = function DigitalCoin(tokenID, expiry_date) {
    this.tokenID = tokenID;
    this.expire = expiry_date;
    return this;
}
var getToken = function (tokenID, callback) {
    database.getDatabase().collection(nameCollection).findOne({tokenID: tokenID}, {_id: 0}, function (err, token) {
        callback(token);
    });
}
var addToken = function (token, callback) {
    database.getDatabase().collection(nameCollection).insert(token, function (err, inserted) {
        console.log(err);
        if (err)
            callback(false);
        else
            callback(true);
    });
}
var deleteToken = function (tokenID, callback) {
    database.getDatabase().collection(nameCollection).remove({tokenID: tokenID}, function (err, numDeleted) {
        if (numDeleted == 0 || err) {
            callback(false);
        }
        else
            callback(true);
    })
}