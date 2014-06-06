/**
 * Created by alin on 5/3/14.
 */
var token = require('../api/token');
var getLoginPage = function (req, res) {
    if(req.session.error)
        res.render('adminLogin', { title: 'Drool', error: req.session.error });
    else{
        res.render('adminLogin', { title: 'Drool', error: "" });
    }
    req.session.error="";
};

var postLogoutPage = function(req, res){
    req.session.name = null;
    res.redirect('/');
};

var postLoginPage = function (req, res) {
    var user = req.param('user', null);
    var password = req.param('password', null);
    var databaseAdmin = require('../models/databaseAdmins');
    databaseAdmin.existsAdmin(user, password, function (exista) {
        if (exista) {
            req.session.name = "admin";
            if(req.session.page){
                if(req.session.page!=""){
                    res.redirect(req.session.page);
                    req.session.page="";
                }else{
                    res.redirect('/controlpanel');
                }
            }
            else{
                res.redirect('/controlpanel');
            }
        }
        else {
            res.render('adminLogin', { title: 'Drool', error: 'User or password incorrect!' });
        }
    });
};
var getControlPanel=function (req, res) {
    if (req.session.name == "admin") {
        res.render('adminControlPanel', { title: 'Drool', error: "" });
    } else {
        res.redirect('/login');
        req.session.error = "Please login first!";
    }
};

var postControlPanel=function (req, res) {
    if (req.session.name == "admin") {
        var tokenID = req.param('setToken', null);
        if (tokenID) {
            token.verifyToken(tokenID, function (exists) {
                if (exists) {
                    req.session.token = tokenID;
                    res.render('adminControlPanel', { title: 'Drool', error: "Token assigned" });
                }
                else {
                    res.render('adminControlPanel', { title: 'Drool', error: "Token invalid" });
                }
            })
        }
        else{
            res.render('adminControlPanel', { title: 'Drool', error:"Token invalid" });
        }
    } else {
        res.redirect('/login');
        req.session.error = "Please login first!";
    }
};

var verifyCredentials=function (req, res, callback) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    req.session.page=fullUrl;
    if (req.session.name == "admin") {
       callback(req,res);
    } else {
        res.redirect('/login');
        req.session.error = "Please login first!";
    }
};
exports.getLoginPage=getLoginPage;
exports.postLogoutPage=postLogoutPage;
exports.postLoginPage=postLoginPage;
exports.getControlPanel=getControlPanel;
exports.postControlPanel=postControlPanel;
exports.verifyCredentials=verifyCredentials;
