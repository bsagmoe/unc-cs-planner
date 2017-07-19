const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Course = require('./course').Course
const autoPopulate = function(next){
    this.populate('courses.past courses.current courses.future');
    next();
}

const User = new Schema({
    name: {
        first: String,
        last: String
    }, classInfo: {
        year: Number,       // Year in school, e.g. 1st, 2nd, etc.
        class: Number,      // Grad year
        majors: {
            type: [String],
            default: []
        },
        minors: {
            type: [String],
            default: []
        }
    }, username: { 
        type: String,
        required: true,
        unique: true
    }, courses: {
        past: [ { type: Schema.Types.ObjectId, ref: 'Course' } ],
        current: [ { type: Schema.Types.ObjectId, ref: 'Course' } ],
        future: [ { type: Schema.Types.ObjectId, ref: 'Course' } ]
    }, private: {  // Whether or not your profile can be seen by the public
        type: Boolean,
        defaul: false
    }, votes: { // Which posts/comments you've voted on. Used to prevent multiple votes
        type: [Schema.Types.ObjectId],
        default: []
    }
});

User.plugin(passportLocalMongoose);
User.pre('findOne', autoPopulate)
    .pre('find', autoPopulate);

module.exports = mongoose.model('User', User);