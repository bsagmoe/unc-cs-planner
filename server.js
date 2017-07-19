const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const cors = require('cors');

// Database stuff
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Authentication stuff
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;

const port = 3000;

app.use(express.static(path.join(__dirname, 'dist')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'unc-cs-planner',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

function errorHandler(err, req, res) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
}

var Post = require('./models/post');
var Comment = require('./models/comment');
var Course = require('./models/course');
var User = require('./models/user');

mongoose.connect('mongodb://localhost/unc-cs-planner');
var db = mongoose.connection;

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){

    app.post('/register', function(req, res){
        User.register(new User({
            name : {
                first: req.body.name.firstName,
                last: req.body.name.lastName
            }, classInfo : {
                year: req.body.classInfo.year,
                class: req.body.classInfo.class,
                majors: req.body.classInfo.majors,
                minors: req.body.classInfo.minors
            }, username: req.body.username,
            private: req.body.private
        }), req.body.password,

        function(err, user){
            if(err){
                res.status(409)
                res.json(err);
            } else {
                res.send(user);
            }

        })
    });


    app.post('/login',  function(req, res){
        passport.authenticate('local',
            function(err, user, info){
                if(user){
                    res.send(user);
                } else {
                    res.status(409);
                    res.send( {message: info.message });
                }
            })(req, res);
    });

    app.get('/logout', function(req, res){
        req.logout();
    })

    app.get('/api/posts', (req, res) => {
        Post.find({}).sort( { date: -1} ).exec(function(err, posts){
            if(err) console.log('could not find posts');
            res.json(posts);
        });
    })

    app.post('/api/posts',
        function(req, res) {
            User.findOne( { _id : req.body.user._id } , 
                function(err, user){
                    if(err) { console.log('could not authenticate user to make post')}
                    if(user) {
                        Post.create({
                            user: new mongo.ObjectID(req.body.user._id),
                            text: req.body.text,
                            tags: req.body.tags
                        }).then(post => {
                            res.status(201);

                            // Need to do a find on the post we just created so that the user field
                            // is populated correctly (otherwise, the client side logic using the user field fails)
                            // NOTE: There's probably a better way to do this
                            Post.findById(post._id, (err, post) => {
                                if(err) console.log('could not find post that was just created')
                                else res.send(post);
                            })

                        }).catch(err => {
                            res.status(500);
                            res.send( {message: 'Could not create post' })
                        });

                    } else {
                        console.log('user could not be found for identification purposes')
                        res.status(401)
                        res.send( { message: 'could not authenticate user' } )
                    };
                })
    });

    app.patch('/api/posts/:postId', (req, res) => {
        User.findById(req.body.user._id, 
                function(err, user){
                    if(err) { console.log('could not authenticate user to update post')}
                    if(user) {

                        Post.findByIdAndUpdate(req.params.postId,
                            { $push: {comments: new mongo.ObjectID(req.body.commentId) }},
                            { new: true }, 
                            function(err, post) {
                                if(post){
                                    res.status(201)
                                    res.send(post.populate('comments'))
                                } else {
                                    res.status(500);
                                    res.send( {message: 'could not update post'})
                                }
                            } )

                    } else {
                        console.log('user could not be found for identification purposes')
                        res.status(401)
                        res.send( { message: 'could not authenticate user' } )
                    };
                })
    });

    app.get('/api/posts/:tags', (req,res) => {
        Post.find({ tags: {$in: JSON.parse(req.params.tags) } } ).sort( { date: -1} )
            .exec(function(err, posts){
                if(err) console.log('could not find post with tag', req.params.tags);
                else {
                    res.send(posts);
                }
            })
    })

    app.post('/api/comments', (req, res) => {
        User.findOne( { _id : req.body.user._id } , 
            function(err, user){
                if(err) { console.log('could not authenticate user to make a comment')}
                if(user) {
                    Comment.create({
                        user: new mongo.ObjectID(req.body.user._id),
                        parent: new mongo.ObjectID(req.body.parent),
                        text: req.body.text,
                    }).then(comment => {
                        res.status(201);
                        
                        // Need to do a find on the comment we just created so that the user field
                        // is populated correctly (otherwise, the client side logic using the user field fails)
                        Comment.findById(comment._id,  (err, comment) => {
                            res.send(comment)
                        })
                    }).catch(err => {
                        res.status(500);
                        res.send( { message: 'Could not create comment' })
                    });

                } else {
                    console.log('user could not be found for identification purposes')
                    res.status(401)
                    res.send( { message: 'could not authenticate user' } )
                };
            })
    })

    app.patch('/api/comments/:commentId', (req, res) => {
        User.findById(req.body.user._id, 
                function(err, user){
                    if(err) { console.log('could not authenticate user to update post')}
                    if(user) {

                        Comment.findByIdAndUpdate(req.params.commentId,
                            { $push: {comments: new mongo.ObjectID(req.body.replyId) }},
                            { new: true }, 
                            function(err, comment) {
                                if(comment){
                                    res.status(201)
                                    res.send(comment.populate('comments'))
                                } else {
                                    res.status(500);
                                    res.send( {message: 'could not update comment'})
                                }
                            } )

                    } else {
                        console.log('user could not be found for identification purposes')
                        res.status(401)
                        res.send( { message: 'could not authenticate user' } )
                    };
                })
    });

    app.get('/api/courses/:dept', function(req, res){
        let min = 0;
        let max = 999;

        if(req.query.min) min = Number(req.query.min)
        if(req.query.max) max = Number(req.query.max)

        let query = {
            'dept': req.params.dept.toUpperCase(),
            'number': {
                $gte: min,
                $lte: max
            }
        }

        Course.find(query, function(err, courses){
            if (err) console.error(err)
            else { 
                res.send(courses)
            }
        })
    })

    app.get('/api/courses/:dept/:number', function(req, res) {
        Course.findOne({'dept': req.params.dept.toUpperCase(), 
                        'number': req.params.number },

                     function(err, course){
                        if(err) console.error(err)
                        else {
                            res.send(course)
                        }
                     })
    })

    app.get('/api/courses/:dept/:number/:modifier', function(req, res) {
        Course.findOne({'dept': req.params.dept.toUpperCase(), 
                        'number': req.params.number,
                        'modifier': req.params.modifier },

                     function(err, course){
                        if(err) console.error(err)
                        else {
                            res.send(course)
                        }
                     })
    })

    app.get('/api/users/:username', function(req, res){
        User.findOne({username: req.params.username}).select('name classInfo username courses private').exec( (err, user) => {
            if(err) console.error(err)
            else {
                if(user) { 
                    res.send(user)
                } else { 
                    res.status(404)
                    res.send()
                }
            }
        })
    })

    app.get('/api/users/:userId/posts', function(req, res) {
        Post.find({ user: req.params.userId }).sort({ date: -1})
            .exec(function(err, posts){
                if(err) console.error(err);
                else {
                    if(posts){
                        res.send(posts)
                    } else {
                        res.status(404)
                        res.send()
                    }
                }
            })
    })

    // TODO: This seems pretty hacky. Refactor into something nicer
    app.patch('/api/users/:userId/courses/:courseId', function(req, res){
        if(req.body.user._id !== req.params.userId){
            console.error('user', req.body.user._id, 'can\'t update user', req.params.userId )
            res.send({ err: 'cannot update another user\'s info'})
        }

        User.findById(req.body.user._id, 
                function(err, user){
                    if(err) { console.log('could not authenticate user to update post')}
                    if(user) {
                        
                        // Remove the course from all of the sublists
                        user.update({ $pull: {'courses.past': req.params.courseId } }, (err, raw) => {
                            console.log(err);
                            console.log(raw);
                        });

                        user.update({ $pull: {'courses.current': req.params.courseId } }, (err, raw) => {
                            console.log(err);
                            console.log(raw);
                        });

                        user.update({ $pull: {'courses.future': req.params.courseId } }, (err, raw) => {
                            console.log(err);
                            console.log(raw);
                        });
                        
                        
                        switch(req.body.status) {
                            case "past":
                                console.log('pushing to past');
                                user.update({$push: {'courses.past': req.params.courseId }}, (err, raw) => {
                                    console.log(raw);
                                    User.findById(req.body.user._id, (err, user) => {
                                        console.log(user);
                                        res.send(user);
                                    });

                                });
                                break;
                            case "current":
                                console.log('pushing to current');
                                user.update({$push: {'courses.current': req.params.courseId }}, (err, raw) => {
                                    console.log(raw);
                                    User.findById(req.body.user._id, (err, user) => {
                                        console.log(user);
                                        res.send(user);
                                    });
                                });
                                break;
                            case "future":
                                console.log('pushing to future');
                                user.update({$push: {'courses.future': req.params.courseId }}, (err, raw) => {
                                    console.log(raw);
                                    User.findById(req.body.user._id, (err, user) => {
                                        console.log(user);
                                        res.send(user);
                                    });
                                }); 
                                break;
                            default:
                                console.log("in default")
                                User.findById(req.body.user._id, (err, user) => {
                                    console.log(user);
                                    res.send(user);
                                })
                        }

                    } else {
                        console.log('user could not be found for identification purposes')
                        res.status(401)
                        res.send( { message: 'could not authenticate user' } )
                    };
                })


    })


    app.listen(port, function(){
        console.log('Listening on port', port);
    });

})

// Enable this for the final production version
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/index.html'));
// });