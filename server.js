var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');

var config = require('./config');
var rootRoute = require('./routes/root');
var taskRoutes = require('./routes/task-routes');

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
    var address = server.address().address,
        port = server.address().port;

    console.log('TaskTracker listening at http://' + address + ':' + port);
});
