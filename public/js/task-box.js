window.TaskBox = (function($, TaskRouter, taskBoxView, window) {
return function(context, type) {
    'use strict';

    var TIMEOUT_SEC = 60;
    var MAX_UNDOS = 10;

    var timer = null,
        taskRouter = new TaskRouter(type);

    function enableRefresh() {
        if (timer) return;

        timer = setTimeout(function() {
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
        checkTask: function() {
            var $this = $(this),
                id = $this.closest('.task-row').data('id');

            taskRouter.check(id, function() {
                taskBoxView.checkTask($this);
                enableRefresh();
            });
        },

        uncheckTask: function(id) {
            var $this = $(this),
                id = $this.closest('.task-row').data('id');

            taskRouter.uncheck(id, function() {
                taskBoxView.uncheckTask($this);
                enableRefresh();
            });
        },

        completeTask: function(e) {
            disableRefresh();
            
            var $this = $(this),
                isComplete = $this.prop('checked');

            if (type === 'one-shot')
                taskBox.deleteTask.call(this);
            else if (isComplete)
                taskBox.checkTask.call(this);
            else
                taskBox.uncheckTask.call(this);
        },

        beginEdit: function() {
            disableRefresh();
            taskBoxView.showEdit($(this));
        },

        endEdit: function() {
            var $this = $(this);

            if (!$this.val())
                return taskBox.cancelEdit.call(this);

            var id = $this.closest('.task-row').data('id'),
                name = $this.val();

            taskRouter.edit(id, name, function() {
                taskBoxView.editTask($this, name);
                taskBoxView.hideEdit($this);
                enableRefresh();
            });
        },

        cancelEdit: function() {
            taskBoxView.hideEdit($(this));
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
                    $(this).val('').blur();
                    break;
            }
        },

        deleteTask: function() {
            disableRefresh();

            var $this = $(this),
                id = $this.closest('.task-row').data('id');

            taskRouter.remove(id, function() {
                taskBoxView.removeTask($this);
                enableRefresh();
            });
        },

        beginAdd: function() {
            disableRefresh();
            
            var $this = $(this);
            taskBoxView.showAdd($this);
        },

        endAdd: function() {
            var $this = $(this);

            if (!$this.val()) {
                taskBoxView.hideAdd($this);
                enableRefresh();
                return;
            }

            taskRouter.add($this.val(), function(html) {
                taskBoxView.addTask($this, html);
                taskBoxView.hideAdd($this);
                enableRefresh();
            });
        },

        addKeypress: function(e) {
            switch (e.which) {
                case 13:
                    e.preventDefault();
                    $(this).blur();
                    break;

                case 27:
                    e.preventDefault();
                    $(this).val('').blur();
                    break;
            }
        },

        refreshList: function() {
            var $this = $(this);

            taskRouter.refresh(function(html) {
                taskBoxView.refresh($this, html);
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
})(jQuery, TaskRouter, taskBoxView, window);
