var mongoose = require('mongoose'); // mongodb module
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var AnswersSchema = new Schema({

answer: {
    type: String,
    default: ''
},
user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
},
question: {
    type: Schema.Types.ObjectId,
    ref: 'Questions'
},
created: {
    type: Date,
    default: Date.now
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

AnswersSchema.virtual('updatedDt').get(function() {
    return dateformat(this.updated, 'dd/mm/yyyy HH:MM');
});

AnswersSchema.virtual('insertedDt').get(function() {
    return dateformat(this.inserted, 'dd/mm/yyyy HH:MM');
});

module.exports = mongoose.model('Answers', AnswersSchema); // Answwer: collection
