define(['jquery'], function($) {
return function(context, taskRouter) {
    'use strict';

    var MAX_QUEUE_SIZE = 10;

    var queue = [];

    var undoQueue = {
        push: function(action, data) {
            var i = MAX_QUEUE_SIZE;

            while (i++ <= queue.length) {
                queue.shift();
            }

            queue.push({action: action, data: data});
            $(context).find('.undo').show();
        },

        queueAdd: function(name) {
            undoQueue.push('add', name);
        },

        queueRemove: function(id) {
            undoQueue.push('remove', id);
        },

        queueCheck: function(id) {
            undoQueue.push('check', id);
        },

        queueUncheck: function(id) {
            undoQueue.push('uncheck', id);
        },

        queueEdit: function(id, name) {
            undoQueue.push('edit', {id: id, name: name});
        },

        undo: function(callback) {
            if (queue.length === 0)
                return callback(null);

            var item = queue.pop(),
                action = taskRouter[item.action];

            var resultFunc = function(result) {
                if (queue.length === 0)
                    $(context).find('.undo').hide();

                callback(item.action, item.data, result);
            };

            if (item.action === 'edit')
                action(item.data.id, item.data.name, resultFunc);
            else
                action(item.data, resultFunc);
        }
    };

    return undoQueue;
};
});
