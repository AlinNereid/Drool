/*
 * GET home page.
 */

exports.get = function (req, res) {
    res.render('index', { title: 'Drool', digitalCoins: ['BITCOIN', 'a', 'b'], realCoins: ['USD', 'EUR', 'RON']});
};
