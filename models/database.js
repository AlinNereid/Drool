/**
 * Created by alin on 5/3/14.
 */
var database;
var MongoClient = require('mongodb').MongoClient;
var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    "mongodb://localhost:27017/dbDrool";
exports.connect=function(callback){
    MongoClient.connect(mongoUri,callback);
}
exports.showDataBase=function(){
    console.log('DB'+database);
}
exports.setDatabase=function(db){
    database=db;
};
exports.getDatabase=function(){
    return database;
}