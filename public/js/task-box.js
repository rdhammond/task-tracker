define(['jquery', 'task-router', 'undo-queue', 'task-box-view'],
function($, TaskRouter, UndoQueue, TaskBoxView) {
return function(context, type) {
    'use strict';

    var TIMEOUT_SEC = 60;

    var timer = null,
        taskBoxView = new TaskBoxView(context),
        taskRouter = new TaskRouter(type),
        undoQueue = new UndoQueue();

    undoQueue.subscribePush(function() {
        taskBoxView.showUndo(true);
    });

    undoQueue.subscribePop(function(count) {
        if (count <= 0)
            taskBoxView.showUndo(false);
    });

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
            var $this = $(this),
                id = taskBoxView.id(this),  // checkbox
                name = taskBoxView.taskNameById(id);

            $this.prop('disabled', true);

            taskRouter.check(id, function() {
                $this.prop('disabled', false);
                taskBoxView.checkTask(id);
                undoQueue.push('check', name);
                //enableRefresh();
            });
        },

        uncheckTask: function(id) {
            var $this = $(this),
                id = taskBoxView.id(this),
                name = taskBoxView.taskNameById(id); // Checkbox

            $this.prop('disabled', true);

            taskRouter.uncheck(id, function() {
                $this.prop('disabled', false);
                taskBoxView.uncheckTask(id);
                undoQueue.push('uncheck', name);
                //enableRefresh();
            });
        },

        completeTask: function(e) { // Checkbox
            //disableRefresh();
            
            if (type === 'one-shot')
                taskBox.deleteTask.call(this);
            else if ($(this).is(':checked'))
                taskBox.checkTask.call(this);
            else
                taskBox.uncheckTask.call(this);
        },

        beginEdit: function() {
            //disableRefresh();

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

            $this.prop('disabled', true);

            taskRouter.edit(id, newName, function() {
                $this.prop('disabled', false);
                taskBoxView.editTask(id, newName);
                taskBoxView.hideEdit(id);

                undoQueue.push('edit', {
                    oldName: oldName,
                    newName: newName
                });

                //enableRefresh();
            });
        },

        cancelEdit: function() {
            var id = taskBoxView.id(this); // Textbox
            taskBoxView.hideEdit(id);
            //enableRefresh();
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
            //disableRefresh();

            var $this = $(this),
                id = taskBoxView.id(this), // button
                name = taskBoxView.taskNameById(id);

            $this.prop('disabled', true);

            taskRouter.remove(id, function() {
                $this.prop('disabled', false);
                taskBoxView.removeTask(id);
                undoQueue.push('delete', name);
                //enableRefresh();
            });
        },

        beginAdd: function() {
            //disableRefresh();
            taskBoxView.showAdd();
        },

        endAdd: function() {
            // Textbox
            var $this = $(this);

            if (!$this.val()) {
                taskBoxView.hideAdd();
                //enableRefresh();
                return;
            }

            var newName = $this.val();
            $this.prop('disabled', true);

            taskRouter.add(newName, function(html) {
                $this.prop('disabled', false);
                var $taskRow = taskBoxView.addTask(html);
                taskBoxView.hideAdd();
                undoQueue.push('add', newName);
                //enableRefresh();
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
            var id, $taskRow;

            var undo = undoQueue.pop();
            if (!undo) return;

            taskBoxView.enableUndo(false);

            switch (undo.action) {
                case 'add':
                    id = taskBoxView.taskIdByName(undo.data);
                    if (!id) return;

                    taskRouter.remove(id, function() {
                        taskBoxView.enableUndo(true);
                        taskBoxView.removeTask(id);
                    });
                    break;

                case 'delete':
                    taskRouter.add(undo.data, function(html) {
                        taskBoxView.enableUndo(true);
                        taskBoxView.addTask(html);
                    });
                    break;

                case 'edit':
                    id = taskBoxView.taskIdByName(undo.data.newName);
                    if (!id) return;

                    taskRouter.edit(id, undo.data.oldName, function() {
                        taskBoxView.enableUndo(true);
                        taskBoxView.editTask(id, undo.data.oldName);
                    });
                    break;

                case 'check':
                    id = taskBoxView.taskIdByName(undo.data);
                    if (!id || !taskBoxView.isChecked(id)) return;

                    taskRouter.uncheck(id, function() {
                        taskBoxView.enableUndo(true);
                        taskBoxView.uncheckTask(id);
                    });
                    break;

                case 'uncheck':
                    id = taskBoxView.taskIdByName(undo.data);
                    if (!id || taskBoxView.isChecked(id)) return;

                    taskRouter.check(id, function() {
                        taskBoxView.enableUndo(true);
                        taskBoxView.checkTask(id);
                    });
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
        $context.on('click', '.undo', taskBox.undo);

        $context.on('click', 'a[disabled]', function(e) {
            e.preventDefault();
            return false;
        });

        //enableRefresh();
    });

    return taskBox;
};
});
