
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var analy = require('./routes/analysis');
var app = express();
var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    "mongodb://localhost:27017/dbDrool";
var database;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/convertor', routes.index);
app.get('/analysis', analy.analysis);
app.get('/api/bitcoin/:numeAPI/:numar',function(req,res){
    var numar=parseInt(req.params.numar);
    var collection = database.collection("collectionDateApi").find({"nameApi":req.params.numeAPI}).sort({dataServer:-1}).limit(numar).toArray(function(err, results) {
        var send_json;
        var array=[];
        for(i=0;i<results.length;i++){
            var obj=results[i];
            array.push({"last":obj["date"]["last"],"bid":obj["date"]["bid"],"timestamp":obj["date"]["timestamp"],"drooltime":obj["dataServer"]});

        }
        res.contentType('application/json');
        send_json={"date":array};
        res.json(send_json);
    });

});
app.get('/api/currency/:m1',function(req,res){
    var m1=req.params.m1;
    console.log(m1);
    var send_json=[];
    if(m1=='ALLCURRENCYREAL'){
        var collection = database.collection("collectionYahooApi").find().toArray(function(err,results){
            var array=[]
            for(i=0;i<results.length;i++){
                var simbol=results[i].symbol;
                array.push(simbol);
            }
            send_json={"allcurrencyreal":array};
            res.contentType('application/json');
            res.json(send_json);
        });
    }
    else{
        var collection = database.collection("collectionYahooApi").find({"symbol":m1}).toArray(function(err,results){
            for(i=0;i<results.length;i++){
                val1=results[i].price;
                //console.log(val1);
            }
            send_json.price=val1;
            res.contentType('application/json');
            res.json(send_json);
        });
    }
});
app.get('/api/currency/:m1/:m2',function(req,res){
    var m1=req.params.m1;
    var m2=req.params.m2;
    var val1;
    var val2;
    var send_json={};
    var collection = database.collection("collectionYahooApi").find({"symbol":m1}).toArray(function(err,results){
        if(results.length==0){
            if(m1=='BITCOIN'){
                var collection3 = database.collection("collectionDateApi").find({"nameApi":"bitcoinaverageUSD"}).sort({dataServer:-1}).limit(1).toArray(function(err, results) {
                    for(i=0;i<results.length;i++){
                        var obj=results[i];
                        val1=obj["date"]["last"];
                    }
                    var collection2 = database.collection("collectionYahooApi").find({"symbol":m2}).toArray(function(err,results){
                        for(i=0;i<results.length;i++){
                            val2=results[i].price;
                        }
                        send_json["val "+m1]=val1;
                        send_json["val "+m2]=val2;
                        send_json.price=val1*val2;
                        if(val2===undefined){
                            send_json.price=val1;
                        }
                        res.contentType('application/json');

                        res.json(send_json);
                    });
                });
            }
        }else{
            for(i=0;i<results.length;i++){
                val1=results[i].price;
                //console.log(val1);
            }
            var collection2 = database.collection("collectionYahooApi").find({"symbol":m2}).toArray(function(err,results){
                for(i=0;i<results.length;i++){
                    val2=results[i].price;
                }
                send_json["val "+m1]=val1;
                send_json["val "+m2]=val2;
                send_json.price=val1/val2;
                console.log(send_json.val1);
                res.contentType('application/json');

                res.json(send_json);
            });
        }
    });
});

var getCurrencyBitcoin=function(url,numeApi,callback){
    request(url,function(err, resp, body){
        if (err && response.statusCode!=200) return console.error(err)
        else{
            try {
                var date=JSON.parse(body);
                if(numeApi=="btc-eUSD"){
                    date=date.ticker;
                }

                console.log(numeApi);
                console.log(date);
                console.log(date.last);

                var dateAPI={
                    "date":date,
                    "nameApi":numeApi,
                    "dataServer":Date.now()
                }

                database.collection("collectionDateApi").find({"date":date,"dataServer":{"$gte":Date.now()-100000}}).toArray(function(err, items) {
                    if (items.length == 0) {
                        database.collection("collectionDateApi").insert(dateAPI, function (err, inserted) {
                            console.log("insert");
                            if(err)
                                console.error(numeApi+"  ----   DB error:", err);
                        });
                    }
                });
            }
            catch (e) {
                console.error(numeApi+"  ----   Parsing error:", e);
            }
        }
    });
};
var getCurrencyReal=function(url,numeApi,callback){
    request(url,function(err, resp, body){
        if (err && response.statusCode!=200) return console.error(err)
        else{
            if(numeApi=="yahooFinance"){
                try {
                    var date=JSON.parse(body);
                    date=date.list.resources;
                    var dateAPI={
                        "date":date,
                        "nameApi":numeApi,
                        "dataServer":Date.now()
                    }
                    database.collection("collectionYahooApi").drop(function(){
                        console.log("drop");
                        for(i=0;i<date.length;i++){
                            var obiectMongo={};
                            var obj=date[i];
                            obiectMongo.symbol=obj.resource.fields.symbol;
                            obiectMongo.symbol=obiectMongo.symbol.substring(0,obiectMongo.symbol.length-2);
                            obiectMongo.price=obj.resource.fields.price;
                            obiectMongo.utctime=obj.resource.fields.utctime;
                            database.collection("collectionYahooApi").insert(obiectMongo, function (err, inserted) {
                                if(err)
                                    console.error(numeApi+"  ----   DB error:", err);
                            });
                        }
                    });

                }
                catch (e) {
                    console.error(numeApi+"  ----   Parsing error:", e);
                }
            }
        }
    });
};
var timeRequest=60000;
// Connect to the db
MongoClient.connect("mongodb://localhost:27017/dbDrool", function(err, db) {
    if(err) throw err;
    else {
        console.log("We are connected");
        database=db;
        http.createServer(app).listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port'));
        });
        setInterval(getCurrencyBitcoin,timeRequest,"https://api.bitcoinaverage.com/ticker/global/USD/","bitcoinaverageUSD");
        setInterval(getCurrencyBitcoin,timeRequest,"https://www.bitstamp.net/api/ticker/","bitstampUSD");
        setInterval(getCurrencyBitcoin,timeRequest,"https://btc-e.com/api/2/btc_usd/ticker","btc-eUSD");
        setInterval(getCurrencyReal,timeRequest*3,"http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json","yahooFinance");
    }
});

