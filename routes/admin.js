/**
 * Created by alin on 5/3/14.
 */
exports.getLoginPage = function (req, res) {
    if(req.session.error)
        res.render('adminLogin', { title: 'Drool', error: req.session.error });
    res.render('adminLogin', { title: 'Drool', error: "" });
    req.session.error="";
};
exports.postLoginPage = function (req, res) {
    var user = req.param('user', null);
    var password = req.param('password', null);
    var databaseAdmin = require('../models/databaseAdmins');
    databaseAdmin.existsAdmin(user, password, function (exista) {
        if (exista) {
            req.session.name = "admin";
            res.redirect('/controlpanel');
        }
        else {
            res.render('adminLogin', { title: 'Drool', error: 'User or password incorrect!' });
        }
    });
};