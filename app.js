/**
 * Module dependencies.
 */

var express = require('express');
var index = require('./routes/index');
var http = require('http');
var path = require('path');
var analysis = require('./routes/analysis');
var rates = require('./routes/rates');
var adminRoute = require('./routes/admin');
var database = require('./models/database');
var apiRoute = require('./routes/apiTicker');
var digitalCoinRoute = require('./routes/digitalCoin');
var dbDigitalCoins = require('./models/dbDigitalCoins');
var dbRealCoins = require('./models/dbRealCoins');
var parser = require('./parser+requestAPI+convertor/parse');
var realCoins = require('./parser+requestAPI+convertor/realCoins');
var digitalCoins = require('./parser+requestAPI+convertor/digitalCoins');
var intervalRequests = require('./parser+requestAPI+convertor/intervalRequests');
var convertorEngine = require('./parser+requestAPI+convertor/convertor');
var apiConvertor = require('./api/convertor');
var apiRealCoins = require('./api/realAPI');
var apiDigitalCoin = require('./api/digitalCoinApi');
var apiTIcker = require('./api/apiTIcker');
var apiValues = require('./api/values');
var apiCoins = require('./api/coins');
var token = require('./api/token');
var app = express();
var request = require('request');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());


app.use(express.cookieParser());

var session = express.session({
    secret: '1234567890QWERTY'
});
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
app.get('/login', session, adminRoute.getLoginPage);
app.get('/logout', session, adminRoute.getLogoutPage);
app.get('/controlpanel', session, adminRoute.getControlPanel);
app.post('/controlpanel', session,adminRoute.postControlPanel);

app.get('/controlpanel/showDigitalCoins', session, digitalCoinRoute.getPageShowDigital);

app.post('/controlpanel/addDigitalCoin', session, digitalCoinRoute.postPageDigital);
app.get('/controlpanel/addDigitalCoin', session, digitalCoinRoute.getPageAddDigital);

app.post('/controlpanel/editDigitalCoin', session, digitalCoinRoute.postPageUpdateDigital);
app.get('/controlpanel/editDigitalCoin/:name', session, digitalCoinRoute.getPageUpdateDigital);
app.post('/controlpanel/editDigitalCoin/:name', session, digitalCoinRoute.postPageUpdateDigital);

app.get('/controlpanel/deleteDigitalCoin/:name', session, digitalCoinRoute.postDeletePage);//de modificat

app.get('/controlpanel/addApi', session, apiRoute.getAddApiPage);
app.post('/controlpanel/addApi', session,  apiRoute.postPageDigital);

app.get('/controlpanel/editApi/:name', session,  apiRoute.getUpdateApiPage);
app.post('/controlpanel/editApi/:name', session,  apiRoute.postUpdatePage);

app.get('/controlpanel/showApis', session, apiRoute.getPageShowApis);

app.post('/api/generateToken', session, token.POSTtokenApi);
//de modificat
app.get('/api/parse', function (req, res) {
    res.contentType('application/json');
    var url = req.param('url', null);
    console.log(url);
    if (url !== null && url !== "") {
        var dateParsate = parser.parseUrl(url, function (dateParsate) {
            console.log("dateParsate : " + dateParsate);
            res.send(dateParsate)
        });

    }
});
app.post('/api/uniqueCoin',apiDigitalCoin.POSTUniqueName);
app.post('/api/uniqueApi',apiTIcker.POSTUniqueApi);
/*app.get('/api/real',function(req,res){
 dbRealCoins.getAllRealSymbolPriceCoins(function(coins){
 res.contentType('application/json');
 console.log("app/real" + coins);
 res.send(coins)
 })
 });*/

//api
app.get('/api/coins', apiCoins.GETcoins);
app.get('/api/coins/real', apiRealCoins.GETall);
app.get('/api/coins/real/:name', apiRealCoins.GETByName);


app.get('/api/coins/digital', apiDigitalCoin.GETall);
app.post('/api/coins/digital', apiDigitalCoin.POSTinROOT);

app.get('/api/coins/digital/:nameDigital', apiDigitalCoin.GETByNameDigital);//get a digitalcoin
app.put('/api/coins/digital/:nameDigital', apiDigitalCoin.PUTByNameDigital);//edit/update
app.delete('/api/coins/digital/:nameDigital', apiDigitalCoin.DELETEByName);//delete

app.get('/api/coins/digital/:nameDigital/apiTickers', apiTIcker.GETallApiWithDigital);//get all apis for a digitalCoin
app.post('/api/coins/digital/:nameDigital/apiTickers', apiTIcker.POSTinROOT);//add a api

app.get('/api/coins/digital/:nameDigital/apiTickers/:nameApi', apiTIcker.GETApiWithDigital);//get a api
app.put('/api/coins/digital/:nameDigital/apiTickers/:nameApi', apiTIcker.PUTByDigNameApiName);//update
app.delete('/api/coins/digital/:nameDigital/apiTickers/:nameApi', apiTIcker.DELETEApi);//delete

app.get('/api/coins/digital/:nameDigital/apiTickers/:nameApi/values', apiValues.GETValues);//get values

app.post('/api/convert', apiConvertor.convertAPI);//convertor

//de scos
app.put('/api/test', function (req, res) {

    var p1 = req.param("p1", null);
    console.log("put " + p1);
    res.contentType('application/json');
    res.send({test: "123"});
});

app.get('/controlpanel/deleteApi/:name', apiRoute.postDeleteApiPage);
app.post('/login', session, adminRoute.postLoginPage);
app.get('/logout', session, function (req, res) {
    req.session.name = null;
});
app.get('/', index.get);
app.get('/convertor', index.get);
app.get('/analysis', analysis.get);
app.get('/rates', rates.get);
var getDate = function (send_json, lastDate, numar, delay, callback) {//de scos
    if (numar != 0) {
        database.getDatabase().collection("bitstamp").find({date: {$lt: lastDate - delay}}, {_id: 0}).sort({date: -1}).limit(1).toArray(function (err, results) {
            if (results != null) {
                try {
                    lastDate = results[0].date;
                    send_json["date"].push(results[0]);
                    numar = numar - 1;
                    getDate(send_json, lastDate, numar, delay, callback);
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
app.get('/api/bitcoin/:numeAPI/:numar', function (req, res) {//de scos
    if (req.params.numeAPI == "test") {
        var delay = 72000 * 12;
        var send_json = {};
        var numar = parseInt(req.params.numar);
        var lastDate;
        database.getDatabase().collection("bitstamp").find({}, {_id: 0}).sort({date: -1}).limit(1).toArray(function (err, results) {
            numar = numar - 1;
            send_json["date"] = [];
            send_json["date"].push(results[0]);
            lastDate = results[0].date;
            if (numar > 0) {
                getDate(send_json, lastDate, numar, delay, function (send_json) {
                    res.contentType('application/json');
                    res.json(send_json);
                })
            } else {
                res.contentType('application/json');
                res.json(send_json);
            }

        })
    }
    else {
        var numar = parseInt(req.params.numar);
        var collection = database.getDatabase().collection("collectionDateApi").find({"nameApi": req.params.numeAPI}).sort({dataServer: -1}).limit(numar).toArray(function (err, results) {
            var send_json;
            var array = [];
            for (i = 0; i < results.length; i++) {
                var obj = results[i];
                array.push({"last": obj["date"]["last"], "bid": obj["date"]["bid"], "timestamp": obj["date"]["timestamp"], "drooltime": obj["dataServer"]});

            }
            res.contentType('application/json');
            send_json = {"date": array};
            res.json(send_json);
        });
    }
});

app.get('/api/currency/:m1', function (req, res) {//de scos
    var m1 = req.params.m1;
    console.log(m1);
    var send_json = [];
    if (m1 == 'ALLCURRENCYREAL') {
        var collection = database.getDatabase().collection("YahooFinanceCurrency").find().toArray(function (err, results) {
            var array = []
            for (i = 0; i < results.length; i++) {
                var simbol = results[i].symbol;
                array.push(simbol);
            }
            send_json = {"allcurrencyreal": array};
            res.contentType('application/json');
            res.json(send_json);
        });
    }
    else {
        var collection = database.getDatabase().collection("YahooFinanceCurrency").find({"symbol": m1}).toArray(function (err, results) {
            for (i = 0; i < results.length; i++) {
                val1 = results[i].price;
                //console.log(val1);
            }
            send_json.price = val1;
            res.contentType('application/json');
            res.json(send_json);
        });
    }
});
app.get('/api/currency/:m1/:m2', function (req, res) {//de scos
    var m1 = req.params.m1;
    var m2 = req.params.m2;
    var val1;
    var val2;
    var send_json = {};
    var collection = database.getDatabase().collection("collectionYahooApi").find({"symbol": m1}).toArray(function (err, results) {
        if (results.length == 0) {
            if (m1 == 'BITCOIN') {
                var collection3 = database.getDatabase().collection("collectionDateApi").find({"nameApi": "bitcoinaverageUSD"}).sort({dataServer: -1}).limit(1).toArray(function (err, results) {
                    for (i = 0; i < results.length; i++) {
                        var obj = results[i];
                        val1 = obj["date"]["last"];
                    }
                    var collection2 = database.getDatabase().collection("collectionYahooApi").find({"symbol": m2}).toArray(function (err, results) {
                        for (i = 0; i < results.length; i++) {
                            val2 = results[i].price;
                        }
                        send_json["val " + m1] = val1;
                        send_json["val " + m2] = val2;
                        send_json.price = val1 * val2;
                        if ((val2 === undefined && results > 0) || m2 == "USD") {
                            send_json.price = val1;
                        }
                        res.contentType('application/json');

                        res.json(send_json);
                    });
                });
            }
        } else {
            for (i = 0; i < results.length; i++) {
                val1 = results[i].price;
                //console.log(val1);
            }
            var collection2 = database.getDatabase().collection("collectionYahooApi").find({"symbol": m2}).toArray(function (err, results) {
                for (i = 0; i < results.length; i++) {
                    val2 = results[i].price;
                }
                send_json["val " + m1] = val1;
                send_json["val " + m2] = val2;
                send_json.price = val1 / val2;
                console.log(send_json.val1);
                res.contentType('application/json');

                res.json(send_json);
            });
        }
    });
});

var getCurrencyBitcoin = function (url, numeApi, callback) {//de scos
    request(url, function (err, resp, body) {
        if (err) return console.error(err)
        else {
            try {
                var date = JSON.parse(body);
                if (numeApi == "btc-eUSD") {
                    date = date.ticker;
                }

                console.log(numeApi);
                console.log(date);
                console.log(date.last);

                var dateAPI = {
                    "date": date,
                    "nameApi": numeApi,
                    "dataServer": Date.now()
                }

                database.getDatabase().collection("collectionDateApi").find({"date": date, "dataServer": {"$gte": Date.now() - 100000}}).toArray(function (err, items) {
                    if (items.length == 0) {
                        database.getDatabase().collection("collectionDateApi").insert(dateAPI, function (err, inserted) {
                            console.log("insert");
                            if (err)
                                console.error(numeApi + "  ----   DB error:", err);
                        });
                    }
                });
            }
            catch (e) {
                console.error(numeApi + "  ----   Parsing error:", e);
            }
        }
    });
};
/*var getCurrencyReal=function(url,numeApi,callback){
 request(url,function(err, resp, body){
 if (err && resp.statusCode!=200) return console.error(err)
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
 console.log("Update yahooFinance")
 for(i=0;i<date.length;i++){
 var obiectMongo={};
 var obj=date[i];
 obiectMongo.symbol=obj.resource.fields.symbol;
 obiectMongo.symbol=obiectMongo.symbol.substring(0,obiectMongo.symbol.length-2);
 obiectMongo.price=obj.resource.fields.price;
 obiectMongo.utctime=obj.resource.fields.utctime;
 database.getDatabase().collection("collectionYahooApi").update({"symbol":obiectMongo.symbol},obiectMongo,{"upsert":true}, function (err, inserted) {
 if(err)
 console.error(numeApi+"  ----   DB error:", err);
 });
 }
 }
 catch (e) {
 console.error(numeApi+"  ----   Parsing error:", e);
 }
 }
 }
 });
 };*/
var timeRequest = 60000;
/*app.use(function(req, res, next){
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('notFound', {title: "Drool", page: fullUrl});
})*/
// Connect to the db
database.connect(function (err, db) {
    if (err) throw err;
    else {
        console.log("We are connected to MONGODB");
        database.setDatabase(db);
        database.showDataBase();
        http.createServer(app).listen(app.get('port'), function () {
            console.log('Express server DROOL listening on port ' + app.get('port'));
        });
        realCoins.getRealCurrency("http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json", "yahooFinance");
        setInterval(realCoins.getRealCurrency,timeRequest,"http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json","yahooFinance");
        intervalRequests.StartAllApi();
        /* getCurrencyReal("http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json","yahooFinance");*/
        /*intervalRequests.addInterval("bitstamp", 30000);
        digitalCoins.getCurrency("bitstamp");*/
//        api.getLowerValueInUSD(2,"TESTCOIN",function(lowerValue){
//            console.log("1_lowerValue" + lowerValue);
//        });
//        api.getValueInUSD(2,"BTC","BTC123",function(lowerValue){
//            console.log("lowerValue" + lowerValue);
//        });
//        api.getValueInUSDReal("EU1R",function(value){
//            console.log("EUR " +value);
//        });
        //
        convertorEngine.convert(3, "LTC", null, "RON", null, function (value) {
            console.log("VALOARE          " + value);
        });

        token.addToken(3, function (tokenID) {
            console.log("token " + tokenID);
        });

        token.verifyToken("88cdbdc7623faf4a008623ec8bbe3ecf8285e722", function (ok) {
            console.log("verify " + ok);
        });
        /* setInterva(getCurrencyBitcoin,timeRequest,"https://api.bitcoinaverage.com/ticker/global/USD/","bitcoinaverageUSD");
         setInterval(getCurrencyBitcoin,timeRequest,"https://www.bitstamp.net/api/ticker/","bitstampUSD");
         setInterval(getCurrencyBitcoin,timeRequest,"https://btc-e.com/api/2/btc_usd/ticker","btc-eUSD");*/
        //setInterval(getCurrencyReal,timeRequest*3,"http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json","yahooFinance");
    }
});
/*
 MongoClient.connect("mongodb://localhost:27017/dbDrool", function(err, db) {
 if(err) throw err;
 else {
 console.log("We are connected");
 database.setDatabase(db);
 database.showDataBase();
 http.createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
 });
 setInterval(getCurrencyBitcoin,timeRequest,"https://api.bitcoinaverage.com/ticker/global/USD/","bitcoinaverageUSD");
 setInterval(getCurrencyBitcoin,timeRequest,"https://www.bitstamp.net/api/ticker/","bitstampUSD");
 setInterval(getCurrencyBitcoin,timeRequest,"https://btc-e.com/api/2/btc_usd/ticker","btc-eUSD");
 setInterval(getCurrencyReal,timeRequest*3,"http://finance.yahoo.com/webservice/v1/symbols/allcurrencies/quote?format=json","yahooFinance");
 }
 });
 */

