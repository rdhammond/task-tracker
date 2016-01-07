window.TaskBox = (function($, TaskRouter, UndoQueue, TaskBoxView) {
return function(context, type) {
    'use strict';

    var TIMEOUT_SEC = 60;
    var MAX_UNDOS = 10;

    var timer = null,
        taskBoxView = new TaskBoxView(context),
        taskRouter = new TaskRouter(type),
        undoQueue = new UndoQueue(context, taskRouter);

    function enableRefresh() {
        if (timer) return;

        timer = window.setTimeout(function() {
            timer = null;
            taskBox.refreshList();
        
        }, TIMEOUT_SEC*1000);
    }

    function disableRefresh() {
        if (!timer) return;

        window.clearTimeout(timer);
        timer = null;
    }

    var taskBox = {
        checkTask: function() {
            var id = taskBoxView.id(this); // Checkbox

            taskRouter.check(id, function() {
                taskBoxView.checkTask(id);
                undoQueue.queueUncheck(id);
                enableRefresh();
            });
        },

        uncheckTask: function(id) {
            var id = taskBoxView.id(this); // Checkbox

            taskRouter.uncheck(id, function() {
                taskBoxView.uncheckTask(id);
                undoQueue.queueCheck(id);
                enableRefresh();
            });
        },

        completeTask: function(e) { // Checkbox
            disableRefresh();
            
            if (type === 'one-shot')
                taskBox.deleteTask.call(this);
            else if (isComplete)
                taskBox.checkTask.call(this);
            else
                taskBox.uncheckTask.call(this);
        },

        beginEdit: function() {
            disableRefresh();

            var id = taskBoxView.id(this); // Textbox
            taskBoxView.showEdit(id);
        },

        endEdit: function() {
            var $this = $(this); // Textbox

            if (!$this.val())
                return taskBox.cancelEdit.call(this);

            var id = taskBoxView.id(this),
                oldName = taskBoxView.taskNameById(id),
                newName = $this.val();

            taskRouter.edit(id, newName, function() {
                taskBoxView.editTask(id, newName);
                taskBoxView.hideEdit();
                undoQueue.queueEdit(id, oldName);
                enableRefresh();
            });
        },

        cancelEdit: function() {
            var id = taskBoxView.id(this); // Textbox
            taskBoxView.hideEdit(id);
            enableRefresh();
        },

        editKeypress: function(e) {
            // Textbox
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

            var id = taskBoxView.id(this), // button
                name = taskBoxView.taskNameById(id);

            taskRouter.remove(id, function() {
                taskBoxView.removeTask(id);
                undoQueue.queueAdd(name);
                enableRefresh();
            });
        },

        beginAdd: function() {
            disableRefresh();
            taskBoxView.showAdd();
        },

        endAdd: function() {
            // Textbox
            var $this = $(this);

            if (!$this.val()) {
                taskBoxView.hideAdd();
                enableRefresh();
                return;
            }

            var id = taskBoxView.id(this),
                newName = $this.val();

            taskRouter.add(newName, function(html) {
                var $taskRow = taskBoxView.addTask(html),
                    id = taskBoxView.id($taskRow[0]);

                taskBoxView.hideAdd();
                undoQueue.queueRemove(id);
                enableRefresh();
            });
        },

        addKeypress: function(e) {
            // Textbox
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
                taskBoxView.refresh(html);
            });

            enableTimeout();
        },

        undo: function() {
            undoQueue.undo(function(action, data, result) {
                if (action === null)
                    return;

                switch (action) {
                    case 'add':
                        taskBoxView.addTask(result);
                        break;
                    case 'remove':
                        taskBoxView.removeTask(data);
                        break;
                    case 'edit':
                        taskBoxView.editTask(data.id, data.name);
                        break;
                    case 'check':
                        taskBoxView.checkTask(data);
                        break;
                    case 'uncheck':
                        taskBoxView.uncheckTask(data);
                        break;
                }
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
        $context.on('click', '.undo', taskBox.undo);

        enableRefresh();
    });

    return taskBox;
};
})(jQuery, TaskRouter, UndoQueue, TaskBoxView);
