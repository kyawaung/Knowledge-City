var mongoose = require('mongoose'); // mongodb module
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var QuestionSchema = new Schema({
    // define data fields
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
    },
    detail: {
        text: String,
        html: String,
    },
    dispOrder: {
        type: Number,
        required: true,
        default: 0,
    },
    hits:{
        type: Number,
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

QuestionSchema.virtual('updatedDt').get(function() {
    return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

QuestionSchema.virtual('insertedDt').get(function() {
    return dateformat(this.inserted, 'dd/mm/yyyy HH:MM');
});
module.exports = mongoose.model('Questions', QuestionSchema); // Questions: collection
