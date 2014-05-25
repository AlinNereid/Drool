/**
 * Created by alin on 4/24/14.
 */
var dbAPITicker = require('../models/dbAPITicker');
var dbDigitalCoins = require('../models/dbDigitalCoins');
var get = function (req, res) {
        dbDigitalCoins.getAllDigitalCoins(function(coins){
            dbAPITicker.getAllApisWithDigSname(coins[0].sname,function(apis){
                res.render('analysis', { title: 'Drool',apis:apis,digCoins:coins });
            })
        })

};

exports.get=get;