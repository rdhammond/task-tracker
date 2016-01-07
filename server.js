var express = require('express'),
    exphbs = require('express-handlebars'),
    mongoose = require('mongoose'),
    cookieSession = require('cookie-session');

var config = require('./config'),
    rootRoute = require('./routes/root'),
    taskRoutes = require('./routes/task-routes'),
    TaskCron = require('./cron/task-cron.js');

var blocks = {};

function extend(context, options) {
    if (!blocks[context])
        blocks[context] = [];
    
    blocks[context].push(options.fn(this));
}

function block(context) {
    var block = blocks[context] || [];
    blocks[context] = [];

    return block.join('\n');
}

var hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        extend: extend,
        block: block
    }
});

mongoose.connect(config.mongoDb);

var app = express();
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('trust proxy', 1);

app.use(cookieSession({
    name: 'taskTrackerSession',
    secret: config.sessionSecret
}));

app.use(express.static(__dirname + '/public'));
app.use('/', rootRoute);
app.use('/tasks/one-shot', taskRoutes.oneShot);
app.use('/tasks/daily', taskRoutes.daily);
app.use('/tasks/weekly', taskRoutes.weekly);
app.use('/tasks/monthly', taskRoutes.monthly);
app.use('/tasks/yearly', taskRoutes.yearly);

var server = app.listen(config.port, function() {
    var cronJob = new TaskCron(),
        address = server.address().address,
        port = server.address().port;

    console.log('TaskTracker listening at http://' + address + ':' + port);
});
