/**
 * Created by alin on 5/17/14.
 */
var dbDigitalCoins = require('../models/dbDigitalCoins');
var dbApiTicker = require('../models/dbAPITicker');
//db.digitalCoins.ensureIndex( { sname: 1 }, { unique: true } )
exports.getPageAddDigital=function(req,res){
    res.render('addDigitalCoin',{error:"",title: 'Drool Admin',sname:"",lname:"",page:""});
};
exports.getPageShowDigital=function(req,res){
    dbDigitalCoins.getAllDigitalCoins(function(digitalCoins){
        res.render('showDigitalCoins',{title : 'Digital Coins',digitalCoins:digitalCoins});
    });
};
exports.getPageUpdateDigital=function(req,res){
    var sname=req.params.name;
    if(sname !== "" && sname !== null){
        dbDigitalCoins.getDigitalCoin(sname,function(digitalCoins){
            if(digitalCoins !=="" && digitalCoins!== null)
                res.render('updateDigitalCoin',{error:"", title : 'Update Digital Coin'
                    ,sname:digitalCoins.sname,lname:digitalCoins.lname,page:digitalCoins.page});
            else{
                res.send("date invalide");
            }
        });
    }
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
exports.postPageUpdateDigital=function(req,res){
    var sname = req.param('sname', null);
    var lname = req.param('lname', null);
    var page = req.param('page',null);
    if(sname !== "" && sname!==null)
        dbDigitalCoins.updateDigitalCoin(new dbDigitalCoins.DigitalCoin(sname,lname,page),function(exista){
            if(exista==true)
                res.send("Update in bd");
            else
                res.render('updateDigitalCoin',{error:"Moneda exista in baza de date", title: 'Drool Admin',sname:sname,lname:lname,page:page});
        })
    else{
        res.render('updateDigitalCoin',{error:"Date invalide", title: 'Drool Admin',sname:sname,lname:lname,page:page});
    }
}
exports.postDeletePage = function(req,res){
    var sname=req.params.name;
    if(sname !== "" && sname !== null){
        dbApiTicker.deleteAllApiWithDigital(sname,function(apisDeleted){
            if(apisDeleted==true){
                console.log("am sters si api'uri");
            }
            dbDigitalCoins.deleteDigitalCoin(sname,function(digitalCoins){
                if(digitalCoins == true)
                    res.send(digitalCoins);
                else{
                    res.send("date invalide");
                }
            });
        });

    }
}