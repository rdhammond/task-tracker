window.root = (function(TaskBox) {
    'use strict';

    var root = {
        oneShots: new TaskBox('.one-shots', 'one-shot'),
        dailies: new TaskBox('.dailies', 'daily'),
        weeklies: new TaskBox('.weeklies', 'weekly'),
        monthlies: new TaskBox('.monthlies', 'monthly'),
        yearlies: new TaskBox('.yearlies', 'yearly')
    };

    return root;

})(TaskBox);
