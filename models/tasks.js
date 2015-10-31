var mongoose = require('mongoose');

var OneShotSchema = require('./one-shot');
var TaskSchema = require('./task-schema');

module.exports = {
    OneShot: mongoose.model('OneShot', OneShotSchema),
    Daily: mongoose.model('Daily', new TaskSchema('d')),
    Weekly: mongoose.model('Weekly', new TaskSchema('w')),
    Monthly: mongoose.model('Monthly', new TaskSchema('M')),
    Yearly: mongoose.model('Yearly', new TaskSchema('y'))
};
