window.TaskBox = (function($, TaskRouter) {
return function(context, type) {
    'use strict';

    var TIMEOUT_SEC = 60;
    var MAX_UNDOS = 10;

    var timer = null,
        taskRouter = new TaskRouter(type);

    function enableRefresh() {
        if (timer) return;

        timer = window.setTimeout(function() {
            timer = null;
            taskBox.refreshList();
        
        },TIMEOUT_SEC*1000);
    }

    function disableRefresh() {
        if (!timer) return;

        window.clearTimeout(timer);
        timer = null;
    }

    var taskBox = {
        completeTask: function(e) {
            disableRefresh();

            var $this = $(this),
                $taskRow = $this.closest('.task-row'),
                id = $taskRow.data('id'),
                isComplete = $this.prop('checked');

            var action = type === 'one-shot'
                ? taskRouter.remove.bind(taskRouter, id)
                : isComplete
                    ? taskRouter.check.bind(taskRouter, id)
                    : taskRouter.uncheck.bind(taskRouter, id);

            action(function() {
                if (type === 'one-shot')
                    $taskRow.remove();

                enableRefresh();
            });
        },

        beginEdit: function() {
            disableRefresh();
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

            var $taskRow = $this.closest('.task-row'),
                id = $taskRow.data('id'),
                name = $this.val();

            taskRouter.edit(id, name, function() {
                $this.parents('.edit-panel')
                    .hide()
                    .siblings('.view-panel')
                    .show()
                    .children('.name-label')
                    .text(name);

                enableRefresh();
            });
        },

        cancelEdit: function() {
            $(this).parents('.edit-panel')
                .hide()
                .siblings('.view-panel')
                .show();

            enableRefresh();
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
            disableRefresh();

            var $taskRow = $(this).parents('.task-row'),
                id = $taskRow.data('id');

            taskRouter.remove(id, function() {
                $taskRow.remove();
                enableRefresh();
            });
        },

        beginAdd: function() {
            disableRefresh();

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

            taskRouter.add($this.val(), function(html) {
                var $newRow = $this.closest('.add-task-row')
                    .before($(html));

                taskBox.hideAdd.call($this[0]);
            });
        },

        hideAdd: function() {
            $(this).parents('.edit-panel')
                .hide()
                .siblings('.view-panel')
                .show();

            enableRefresh();
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
        },

        refreshList: function() {
            taskRouter.refresh(function(html) {
                $('.task-list', context).html(html);
                enableRefresh();
            });
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

        enableRefresh();
    });
};
})(jQuery, TaskRouter);
