/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var database = require('./models/database');//connect to database

var index = require('./routes/index');//convertorRoute
var rates = require('./routes/rates');//ratesRoute
var analysis = require('./routes/analysis');//analysisRoute

var adminRoute = require('./routes/admin');//adminRoute for login/logout and controlpannel
var digitalCoinRoute = require('./routes/digitalCoin');//for add/show digitalCoins
var apiRoute = require('./routes/apiTicker');//for add/show apis



var apiConvertor = require('./api/convertor');//api for convert
var apiRealCoins = require('./api/realAPI');//for get realCoins
var apiDigitalCoin = require('./api/digitalCoinApi');//for add/edit/remove/get digitalcoins
var apiTIcker = require('./api/apiTIcker');//for add/edit/remove/get apis for a digitalCOin
var apiValues = require('./api/values');//for get values for a api
var apiCoins = require('./api/coins');//for get all apis
var token = require('./api/token');//for generate/validate a token


var realCoins = require('./parser+requestAPI+convertor/realCoins');//request for realCoin
var digitalCoins = require('./parser+requestAPI+convertor/digitalCoins');//request for digitalCoin
var intervalRequests = require('./parser+requestAPI+convertor/intervalRequests');//add/remove intervals
var parser = require('./parser+requestAPI+convertor/parse');//parser for JSON

var app = express();

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

app.use(express.favicon("public/images/favicon.ico"));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', index.get);
app.get('/convertor', index.get);
app.get('/analysis', analysis.get);
app.get('/rates', rates.get);

app.get('/login', session, adminRoute.getLoginPage);
app.post('/login', session, adminRoute.postLoginPage);
app.post('/logout', session, adminRoute.postLogoutPage);

app.get('/controlpanel', session, adminRoute.getControlPanel);
app.post('/controlpanel', session,adminRoute.postControlPanel);

app.get('/controlpanel/showDigitalCoins', session, digitalCoinRoute.getPageShowDigital);

app.post('/controlpanel/addDigitalCoin', session, digitalCoinRoute.postPageDigital);
app.get('/controlpanel/addDigitalCoin', session, digitalCoinRoute.getPageAddDigital);

app.post('/controlpanel/editDigitalCoin', session, digitalCoinRoute.postPageUpdateDigital);
app.get('/controlpanel/editDigitalCoin/:name', session, digitalCoinRoute.getPageUpdateDigital);
app.post('/controlpanel/editDigitalCoin/:name', session, digitalCoinRoute.postPageUpdateDigital);

app.get('/controlpanel/addApi', session, apiRoute.getAddApiPage);
app.post('/controlpanel/addApi', session,  apiRoute.postPageDigital);

app.get('/controlpanel/editApi/:name', session,  apiRoute.getUpdateApiPage);
app.post('/controlpanel/editApi/:name', session,  apiRoute.postUpdatePage);

app.get('/controlpanel/showApis', session, apiRoute.getPageShowApis);

//api non-standard
app.post('/api/generateToken', session, token.POSTtokenApi);
app.post('/api/parse',parser.POSTparse);
app.post('/api/uniqueCoin',apiDigitalCoin.POSTUniqueName);
app.post('/api/uniqueApi',apiTIcker.POSTUniqueApi);
app.post('/api/convert', apiConvertor.convertAPI);

//api
app.get('/api/coins', apiCoins.GETcoins);//get all coins
app.get('/api/coins/real', apiRealCoins.GETall);//get all real coins
app.get('/api/coins/real/:name', apiRealCoins.GETByName);//get a real coin with specific name


app.get('/api/coins/digital', apiDigitalCoin.GETall); //get all digital coins
app.post('/api/coins/digital', apiDigitalCoin.POSTinROOT); //add a new digital coin

app.get('/api/coins/digital/:nameDigital', apiDigitalCoin.GETByNameDigital);//get a digitalcoin
app.put('/api/coins/digital/:nameDigital', apiDigitalCoin.PUTByNameDigital);//edit/update digital coin
app.delete('/api/coins/digital/:nameDigital', apiDigitalCoin.DELETEByName);//delete digital coin

app.get('/api/coins/digital/:nameDigital/apiTickers', apiTIcker.GETallApiWithDigital);//get all apis for a digitalCoin
app.post('/api/coins/digital/:nameDigital/apiTickers', apiTIcker.POSTinROOT);//add a api

app.get('/api/coins/digital/:nameDigital/apiTickers/:nameApi', apiTIcker.GETApiWithDigital);//get a api
app.put('/api/coins/digital/:nameDigital/apiTickers/:nameApi', apiTIcker.PUTByDigNameApiName);//update api
app.delete('/api/coins/digital/:nameDigital/apiTickers/:nameApi', apiTIcker.DELETEApi);//delete api

app.get('/api/coins/digital/:nameDigital/apiTickers/:nameApi/values', apiValues.GETValues);//get values

/*app.get('/controlpanel/deleteApi/:name', apiRoute.postDeleteApiPage);*/

var timeRequest = 60000;//for realCoin

app.use(function(req, res, next){
    if(req.originalUrl.startsWith('/api')){
        res.contentType('application/json');
        res.send({error:"URL Invalid",documentationURL:"http://students.info.uaic.ro/~elena.pascaru/documentatie.html#apiResources"});
    }else{
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.render('notFound', {title: "Drool", page: fullUrl});
    }
})

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
    }
});