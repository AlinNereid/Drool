/**
 * Created by alin on 5/3/14.
 */
exports.getLoginPage = function(req,res){
    if(req.session.error=="true"){
        res.render('admin', { title: 'Drool', error:'User or password incorrect!' });
    }else
        res.render('admin', { title: 'Drool', error:'' });
};
exports.postLoginPage = function(req,res){
    var user = req.param('user', null);
    var password = req.param('password', null);
    var databaseAdmin=require('../models/databaseAdmins');
    databaseAdmin.existsAdmin(user,password,function(exista){
        if(exista){
            req.session.name="admin";
            req.session.error="false";
            res.redirect('/admin/controlpanel');
        }
        else{
            req.session.name="";
            req.session.error="true";
            res.redirect('./');
        }
    });
};