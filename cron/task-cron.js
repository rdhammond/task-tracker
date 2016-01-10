var Tasks = require('../models/tasks'),
    CronJob = require('cron').CronJob,
    step = require('step');

var now = Date.now();

function resetDaily() {
    console.log('CRON: Running daily task resets.');

    step(
        function() {
            Tasks.Daily.resetCompleted(now, this.parallel());
            Tasks.Weekly.resetCompleted(now, this.parallel());
            Tasks.Monthly.resetCompleted(now, this.parallel());
            Tasks.Yearly.resetCompleted(now, this.parallel());
        },

        function (err) {
            if (err)
                throw err;

            console.log('CRON: Finished running daily task resets.');
        }
    );
}

module.exports = CronJob.bind(null, {
    cronTime: '0 0 0 * * *',
    onTick: resetDaily,
    start: true
});
