/**
 * Created by alin on 5/17/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
//db.digitalCoins.ensureIndex( { sname: 1 }, { unique: true } )
exports.getPageAddDigital=function(req,res){
    res.render('addDigitalCoin',{error:"",title: 'Drool Admin',sname:"",lname:"",page:""});
};
exports.getPageShowDigital=function(req,res){
    dbDigitalCoins.getAllDigitalCoins(function(digitalCoins){
        res.render('showDigitalCoins',{title : 'Digital Coins',digitalCoins:digitalCoins});
    });
};
exports.postPageDigital=function(req,res){
    var sname = req.param('sname', null);
    var lname = req.param('lname', null);
    var page = req.param('page',null);

    if(sname !== "" && sname!==null)
        dbDigitalCoins.addDigitalCoin(new dbDigitalCoins.DigitalCoin(sname,lname,page),function(exista){
            if(exista==true)
                res.send("Add in bd");
            else
                res.render('addDigitalCoin',{error:"Moneda exista in baza de date", title: 'Drool Admin',sname:sname,lname:lname,page:page});
        })
    else{
        res.render('addDigitalCoin',{error:"Date invalide", title: 'Drool Admin',sname:sname,lname:lname,page:page});
    }
};