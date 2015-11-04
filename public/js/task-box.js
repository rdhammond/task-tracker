window.TaskBox = (function($) {
return function(context, type) {
    'use strict';

    function submitTask(type, action, data, callback) {
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

    var taskBox = {
        completeTask: function(e) {
            var $taskRow = $(this).closest('.task-row');

            var data = {
                id: $taskRow.data('id'),
                isComplete: $(this).prop('checked')
            };

            var action = type === 'one-shot' ? 'DELETE' : 'PUT';

            submitTask(type, action, data, function() {
                if (action === 'DELETE')
                    $taskRow.remove();
            });
        },

        beginEdit: function() {
            var $this = $(this);

            $this.parents('.view-panel')
                .hide()
                .siblings('.edit-panel')
                .show()
                .children('.name-input')
                .val($this.text().trim())
                .focus();
        },

        endEdit: function() {
            var $this = $(this);

            if (!$this.val())
                return taskBox.cancelEdit.call(this);

            var data = {
                id: $this.closest('.task-row').data('id'),
                name: $this.val()
            };

            submitTask(type, 'PUT', data, function() {
                $this.parents('.edit-panel')
                    .hide()
                    .siblings('.view-panel')
                    .show()
                    .children('.name-label')
                    .text($this.val());
            });
        },

        cancelEdit: function() {
            $(this).parents('.edit-panel')
                .hide()
                .siblings('.view-panel')
                .show();
        },

        editKeypress: function(e) {
            switch (e.which) {
                case 13:
                    e.preventDefault();
                    $(this).blur();
                    break;

                case 27:
                    e.preventDefault();
                    $(this).val('');
                    $(this).blur();
                    break;
            }
        },

        deleteTask: function() {
            var $taskRow = $(this).parents('.task-row');
            var data = {id: $taskRow.data('id')};

            submitTask(type, 'DELETE', data, function() {
                $taskRow.remove();
            });
        },

        beginAdd: function() {
            var $this = $(this);

            $this.parents('.view-panel')
                .hide()
                .siblings('.edit-panel')
                .show()
                .children('.add-input')
                .val('')
                .focus();
        },

        endAdd: function() {
            var $this = $(this);

            if (!$this.val())
                return taskBox.hideAdd.call(this);

            var data = {
                name: $this.val(),
                isComplete: false
            };

            submitTask(type, 'POST', data, function(html) {
                $this.closest('.add-task-row')
                    .before($(html));

                taskBox.hideAdd.call($this[0]);
            });
        },

        hideAdd: function() {
            $(this).parents('.edit-panel')
                .hide()
                .siblings('.view-panel')
                .show();
        },

        addKeypress: function(e) {
            switch (e.which) {
                case 13:
                    e.preventDefault();
                    $(this).blur();
                    break;

                case 27:
                    e.preventDefault();
                    $(this).val('');
                    $(this).blur();
                    break;
            }
        }
    };

    $(function() {
        var $context = $(context);

        $context.on('change', '.is-complete', taskBox.completeTask);
        $context.on('click', '.name-label', taskBox.beginEdit);
        $context.on('blur', '.name-input', taskBox.endEdit);
        $context.on('keyup', '.name-input', taskBox.editKeypress);
        $context.on('click', '.delete', taskBox.deleteTask);
        $context.on('click', '.add-label', taskBox.beginAdd);
        $context.on('blur', '.add-input', taskBox.endAdd);
        $context.on('keyup', '.add-input', taskBox.addKeypress);
    });
};
})(jQuery);
