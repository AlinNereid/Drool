/**
 * Created by alin on 5/17/14.
 */
var request = require('request');
var allKeys=[];
var dateParsate={};
var type = Function.prototype.call.bind(Object.prototype.toString );

var parse = function(obiect,callback){
    for(key in obiect){
        if(type( obiect[key] ) === '[object Array]')
            allKeys.push('ArrayDrool'+key);
        else
            allKeys.push(key);
        /*console.log(date[key]);*/
        //console.log(type(obiect[key]));
        if( type( obiect[key] ) === '[object Object]' || type( obiect[key] ) === '[object Array]') {
            parse(obiect[key],callback);
        }else{
            dateParsate[allKeys]=obiect[key];
            //console.log(allKeys+'    '+obiect[key]);
        }
        allKeys.pop();
    }
    return dateParsate;
}
exports.POSTparse=function (req, res) {
    res.contentType('application/json');
    var url = req.param('url', null);
    console.log(url);
    if (url !== null && url !== "") {
        var dateParsate = parseUrl(url, function (dateParsate) {
            console.log("dateParsate : " + dateParsate);
            res.send(dateParsate)
        });

    }
};
var parseUrl=function(url,callback){
    allKeys=[];
    dateParsate={};
    request(url,function(err, resp, body){
        if (err) {
            callback(false);
            return console.error(err);
        }
        else{
            try {
                date=JSON.parse(body);
                //console.log(date);
                callback(parse(date));
            }
            catch (e) {
                console.error(url+"  ----   Parsing error:", e);
                callback(false);
            }
        }
    });
};
exports.parseUrl=parseUrl;