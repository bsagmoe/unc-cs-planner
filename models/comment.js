const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoPopulate = function(next){
    this.populate('comments user');
    next();
}

const Comment = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, parent: {
        type: Schema.Types.ObjectId,
        required: true
    }, text: {
        type: String,
        required: true
    }, comments: [ {type: Schema.Types.ObjectId, ref:'Comment'} ]
    , date: {
        type: Date,
        default: Date.now
    }, meta: {
        votes: Number,
        default: 0
    }
});

Comment.pre('findOne', autoPopulate)
       .pre('find', autoPopulate);
       
module.exports = mongoose.model('Comment', Comment);