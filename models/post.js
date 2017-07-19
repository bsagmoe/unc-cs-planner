const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autoPopulate = function(next){
    this.populate('comments user');
    next();
}

const Post = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }, text: {
        type: String,
        required: true
    }, 
    comments: [ {type: Schema.Types.ObjectId, ref:'Comment'} ], 
    tags: {
        type: [String],
        default: []
    }, date: {
        type: Date,
        default: Date.now
    }, meta: {
        votes: Number
    }
})

Post.pre('findOne', autoPopulate)
    .pre('find', autoPopulate)

module.exports = mongoose.model('Post', Post);