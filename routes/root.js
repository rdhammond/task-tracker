var express = require('express');
var router = express.Router();
var step = require('step');

var Tasks = require('../models/tasks');

function toViewModels(title, models) {
    return {
        title: title,
        tasks: models.map(function(model) {
            return model.toViewModel();
        })
    };
}

router.get('/', function(req, res, next) {
    step(
        function() {
            Tasks.OneShot.find({}, this.parallel());
            Tasks.Daily.find({}, this.parallel());
            Tasks.Weekly.find({}, this.parallel());
            Tasks.Monthly.find({}, this.parallel());
            Tasks.Yearly.find({}, this.parallel());
        },

        function (err, oneShots, dailies, weeklies, monthlies, yearlies) {
            if (err) return next(err);

            var viewModel = {
                layout: 'main',
                oneShots: toViewModels('Tasks', oneShots),
                dailies: toViewModels('Daily', dailies),
                weeklies: toViewModels('Weekly', weeklies),
                monthlies: toViewModels('Monthly', monthlies),
                yearlies: toViewModels('Yearly', yearlies)
            };

            res.render('root', viewModel);
        }
    );
});

module.exports = router;
