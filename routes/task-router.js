var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(Task) {
    var router = express.Router();
    router.use(bodyParser.json());

    router.post('/', function(req, res, next) {
        var taskData = Task.fromViewModel(req.body);
        if (taskData._id) delete taskData._id;

        var task = new Task(taskData);

        task.save(function(err) {
            if (err) return next(err);
            res.status(201).render('task-row-wrapper', task.toViewModel());
        });
    });

    router.put('/:id', function(req, res, next) {
        var taskData = Task.fromViewModel(req.body);
        if (taskData._id) delete taskData._id;

        Task.findByIdAndUpdate(req.params.id, taskData, function(err) {
            if (err) return next(err);
            res.status(200).json({success: true});
        });
    });

    router.delete('/:id', function(req, res, next) {
        Task.remove({_id: req.params.id}, function(err) {
            if (err) return next(err);
            res.status(200).json({success: true});
        });
    });

    return router;
};
