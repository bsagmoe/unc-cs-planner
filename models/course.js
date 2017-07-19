const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Course = new Schema({
    dept: {
        type: String,
        required: true
    }, credit_hours: {
        type: String, 
        required: true
    }, modifier: {
        type: String,
        default: ''
    }, number: {
        type: Number,
        required: true
    }, title: {
        type: String,
        required: true
    }, semesters: {
        type: [String],
        default: ["Unknown"]
    }, offerings: {
        type: [ {
            instructor: String,
            semester: String,
            year: Number
        } ],
        default: []
    },
    description: { // From the catalog
        type: String,
        required: true
    }, pre_reqs: {
        type: [Schema.Types.ObjectId], // Point to other courses
        default: []
    }, taken_during: {
        // e.g. [1,2,2,1,3,2,1], with 1 == first year, 2 == second year, etc.
        type: [Number],
        default: []
    }
})

module.exports = mongoose.model('Course', Course)