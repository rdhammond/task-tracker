requirejs.config({
    baseUrl: 'js',
    paths: {
        modernizr: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/vendor/modernizr',
        jquery: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/vendor/jquery',
        foundation: '//cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/foundation.min',
    },
    shim: {
        foundation: {
            deps: ['modernizr', 'jquery']
        }
    }
});

requirejs(['jquery', 'task-box', 'foundation', 'modernizr'],
function($, TaskBox) {
    $(document).foundation();

    var taskBoxes = {
        oneShots: new TaskBox('.one-shots', 'one-shot'),
        dailies: new TaskBox('.dailies', 'daily'),
        weeklies: new TaskBox('.weeklies', 'weekly'),
        monthlies: new TaskBox('.monthlies', 'monthly'),
        yearlies: new TaskBox('.yearlies', 'yearly')
    };
});
