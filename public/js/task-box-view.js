define(['jquery'], function($) {
return function(context) {
    'use strict';

    var $context = $(context);

    var taskBoxView = {
        taskRowById: function(id) {
            return $context.find('.task-row[data-id="' + id + '"]');
        },

        checkTask: function(id) {
            taskBoxView
                .taskRowById(id)
                .find('input[type="checkbox"]')
                .prop('checked', true);
        },

        uncheckTask: function(id) {
            taskBoxView
                .taskRowById(id)
                .find('input[type="checkbox"]')
                .prop('checked', false);
        },

        removeTask: function(id) {
            taskBoxView.taskRowById(id).remove();
        },

        addTask: function(html) {
            return $context
                .find('.add-task-row')
                .before(html)
                .prev();
        },

        showAdd: function() {
            $context
                .find('.add-task-row .view-panel')
                .hide()
                .siblings('.edit-panel')
                .show()
                .find('.add-input')
                .val('')
                .focus();
        },

        hideAdd: function() {
            $context
                .find('.add-task-row .edit-panel')
                .hide()
                .siblings('.view-panel')
                .show();
        },

        editTask: function(id, name) {
            taskBoxView
                .taskRowById(id)
                .find('.name-label')
                .text(name);
        },

        hideEdit: function(id) {
            taskBoxView
                .taskRowById(id)
                .find('.edit-panel')
                .hide()
                .siblings('.view-panel')
                .show();
        },

        showEdit: function(id) {
            var oldName = taskBoxView.taskNameById(id);

            taskBoxView
                .taskRowById(id)
                .find('.view-panel')
                .hide()
                .siblings('.edit-panel')
                .show()
                .children('.name-input')
                .val(oldName)
                .focus();
        },

        refresh: function(html) {
            $context
                .find('.task-list')
                .html(html);
        },

        id: function(control) {
            return $(control)
                .closest('.task-row')
                .data('id');
        },

        taskNameById: function(id) {
            return taskBoxView
                .taskRowById(id)
                .find('.view-panel .name-label')
                .text();
        },

        taskIdByName: function(name) {
            return taskBoxView
                .taskRowByName(name)
                .data('id');
        },

        
        taskRowByName: function(name) {
            name = name.toLowerCase();

            return $context
                .find('.task-list .task-row .name-label')
                .filter(function() {
                    return $(this).text().trim().toLowerCase() === name;
                })
                .closest('.task-row');
        },

        showUndo: function(show) {
            var $undo = $context.find('.undo');

            if (show)
                $undo.show();
            else
                $undo.hide();
        },

        isChecked: function(id) {
            return taskBoxView
                .taskRowById(id)
                .find('input[type="checkbox"]')
                .is(':checked');
        }
    };

    return taskBoxView;

};
});
