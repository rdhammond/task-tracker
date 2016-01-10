window.TaskRouter = (function($) {
return function(type) {
    'use strict';

    function submitTask(action, data, callback) {
        var url = '/tasks/' + type;

        if (data.id)
            url += '/' + data.id;

        $.ajax({
            url: url,
            type: action,
            dataType: 'html',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            success: callback
        });
    }

    return {
        check: function(id, callback) {
            var data = {
                id: id,
                isComplete: true
            };

            submitTask('PUT', data, callback);
        },
        
        uncheck: function(id, callback) {
            var data = {
                id: id,
                isComplete: false
            };

            submitTask('PUT', data, callback);
        },

        add: function(name, callback) {
            var data = {
                name: name,
                isComplete: false
            };

            submitTask('POST', data, callback);
        },

        remove: function(id, callback) {
            submitTask('DELETE', {id:id}, callback);
        },

        edit: function(id, newName, callback) {
            var data = {
                id: id,
                name: newName
            };

            submitTask('PUT', data, callback);
        },

        refresh: function(callback) {
            submitTask('GET', {}, callback);
        }
    };

};
})(jQuery);
