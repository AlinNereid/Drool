/**
 * Created by alin on 4/24/14.
 */


var get = function (req, res) {
    res.render('analysis', { title: 'Drool' });
};

exports.get=get;