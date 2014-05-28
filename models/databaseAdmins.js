/**
 * Created by alin on 5/3/14.
 */
var database=require('./database.js');
var crypto = require('crypto');
exports.existsAdmin=function(user,password,callback){
    shasum = crypto.createHash('sha1');
    shasum.update(password);
    passSHA1 = shasum.digest('hex');
   // console.log(passSHA1);
   /* database.getDatabase().collection("collectionAdmins").insert({user:"admin",password:passSHA1}, function (err, inserted) {
        console.log("insert");
        if(err)
            console.error(numeApi+"  ----   DB error:", err);
    });*/
    database.getDatabase().collection("collectionAdmins").find({"user":user,"password":passSHA1}).toArray(function(err, items) {
        if (items.length == 0) {
            callback(false);
        }else{
            callback(true);
        }
    });
}
