var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

module.exports = function(durationUnit) {
    var schema = new Schema({
        name: {type: String, required: true},
        isComplete: {type: Boolean, required: true, default: false},
        completedDate: Date
    });

    schema.methods.toViewModel = function() {
        var model = {
            id: this._id,
            name: this.name,
            isComplete: this.isComplete,
            isNotOneShot: true
        };

        if (this.isComplete && this.completedDate) {
            model.isComplete = moment(this.completedDate)
                .add(1, durationUnit)
                .isAfter(Date.now(), durationUnit);
        }

        return model;
    };

    schema.statics.fromViewModel = function(viewModel) {
        var model = {};

        if (viewModel.id)
            model._id = viewModel.id;
        if (viewModel.name)
            model.name = viewModel.name;

        if (typeof viewModel.isComplete === 'boolean') {
            model.isComplete = viewModel.isComplete;

            if (viewModel.isComplete)
                model.completedDate = new Date();
        }

        return model;
    };

    return schema;
};
