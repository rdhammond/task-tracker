define(['jquery'], function($) {
return function() {
    'use strict';

    var MAX_QUEUE_SIZE = 10;

    var queue = [],
        pushSubscribers = [],
        popSubscribers = [];

    var undoQueue = {
        push: function(action, data) {
            while (queue.length > MAX_QUEUE_SIZE) {
                queue.shift();
            }

            queue.push({action: action, data: data});

            for (var index in pushSubscribers) {
                pushSubscribers[index]();
            }
        },

        pop: function() {
            var result = queue.pop() || null;

            for (var index in popSubscribers) {
                popSubscribers[index](queue.length);
            }

            return result;
        },

        subscribePush(callback) {
            pushSubscribers.push(callback);
        },

        subscribePop(callback) {
            popSubscribers.push(callback);
        }
    };

    return undoQueue;
};
});
