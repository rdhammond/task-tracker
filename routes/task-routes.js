var Tasks = require('../models/tasks');
var TaskRouter = require('./task-router');

module.exports = {
    oneShot: new TaskRouter(Tasks.OneShot),
    daily: new TaskRouter(Tasks.Daily),
    weekly: new TaskRouter(Tasks.Weekly),
    monthly: new TaskRouter(Tasks.Monthly),
    yearly: new TaskRouter(Tasks.Yearly)
};
