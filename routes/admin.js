/**
 * Created by alin on 5/3/14.
 */
exports.getLoginPage = function(req,res){
    res.render('adminLogin', { title: 'Drool', error:'' });
};
exports.postLoginPage = function(req,res){
    var user = req.param('user', null);
    var password = req.param('password', null);
    var databaseAdmin=require('../models/databaseAdmins');
    databaseAdmin.existsAdmin(user,password,function(exista){
        if(exista){
            req.session.name="admin";
            res.redirect('/admin/controlpanel');
        }
        else{
            res.render('adminLogin', { title: 'Drool', error:'User or password incorrect!' });
        }
    });
};