var mongoose = require('mongoose'); // mongodb module
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var CategorySchema = new Schema({
    // define data fields
    name: {
        my: {
            type: String,
            required: true,
            trim: true,
        }
    },
    dispOrder: {
        type: Number,
        required: true,
        default: 0,
    },
    // System fields
    isDeleted: {
        type: Boolean,
        default: false,
    },
    // Audit fields
    updated: {
        type: Date,
        default: Date.now
    },
    inserted: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    insertedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

CategorySchema.virtual('updatedDt').get(function() {
    return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

CategorySchema.virtual('insertedDt').get(function() {
    return dateformat(this.inserted, 'dd/mm/yyyy HH:MM');
});
module.exports = mongoose.model('Categories', CategorySchema); // Categories: collection
