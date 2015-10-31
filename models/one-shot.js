var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var oneShotSchema = new Schema({
    name: {type: String, required: true}
});

oneShotSchema.methods.toViewModel = function() {
    return {
        id: this._id,
        name: this.name,
        isNotOneShot: false
    };
};

oneShotSchema.statics.fromViewModel = function(viewModel) {
    var model = {};

    if (viewModel._id)
        model._id = viewModel.id;
    if (viewModel.name)
        model.name = viewModel.name;

    return model;
};

module.exports = oneShotSchema;
