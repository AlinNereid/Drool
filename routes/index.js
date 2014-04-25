
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Drool' , digitalCoins:['BITCOIN','a','b'], realCoins:['USD','EUR','RON']});
};
