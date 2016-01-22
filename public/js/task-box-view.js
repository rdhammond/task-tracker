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
                .find('input[type="checkbox"')
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
                .findByTaskId(id)
                .find('.name-label')
                .text(name);
        },

        hideEdit: function(id) {
            taskBoxView
                .findByTaskId(id)
                .find('.edit-panel')
                .hide()
                .siblings('.view-panel')
                .show();
        },

        showEdit: function(id) {
            var $taskRow = taskBoxView.findByTaskId(id),
                oldName = taskBoxView.taskNameById(id);

            findByTaskId
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
        }
    };

    return taskBoxView;

};
});
