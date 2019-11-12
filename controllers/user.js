'use strict';
var passport = require('passport');
var User = require('../models/User');

var email=require('../test/email');
var sms = require('../test/sms');
exports.loginPage = function (request, response) {
    // Redirect to index page if already logged in
    if (request.user) {
        return response.redirect('/');
    }
    response.render('account/login', {
        title : 'Login'
    });
};

exports.login = function (request, response, callback) {
    // input validation
    // request.assert('email', 'Email is not valid').isEmail();
    // request.assert('password', 'Password cannot be blank').notEmpty();

    var errors = request.validationErrors();

    if (errors) {
        request.flash('errors', errors);
        //return response.redirect('/login');
        return response.status(400).send({status:400,code:'bad request',message:'The form is not valid'})

    }
    
    // This refers back to passport.js localStrategy named 'local'
    passport.authenticate('local', function (errors, user, validationMessages) {
        if (errors) {
            return callback(errors);
        }
        if (!user) {
            request.flash('errors', {
                msg : validationMessages.message
            });
           // return response.redirect('/login');
           return response.status(400).send({status:400,code:'invalid user details',message:'Invalid user'})

        }
        request.logIn(user, function (err) {
            if (err) {
                return callback(err);
            }
           // response.redirect(request.session.returnTo || '/');
            return response.status(200).send({status:200,code:'user.login',message:'User login successfully'})

        });
    })(request, response, callback);
};

exports.logout = function (request, response) {
    request.logout();
    response.redirect('/');
};

exports.signupPage = function (request, response) {
    if (request.user) {
        return response.redirect('/');
    }
    response.render('account/signup', {
        title : 'Create Account'
    });
};

exports.signup = function (request, response, callback) {
    console.log('user signup',request.body);
    // input validation
    // request.assert('email', 'Email is not valid').isEmail();
    // request.assert('password', 'Password must be at least 8 characters long').len(8);
    // request.assert('confirmPassword', 'Passwords do not match').equals(request.body.password);

    var errors = request.validationErrors();

    if (errors) {
        request.flash('errors', errors);
        return response.status(400).send({status:400,code:'bad request',message:'The form is not valid'})
    }

    User.findOne({
        email : request.body.email
    }, function (err, existingUser) {
        if (existingUser) {
            request.flash('errors', {
                msg : 'Account with that email address already exists.'
            });
            return response.status(200).send({status:200,code:'user.email.exist',message:'User already exist'})

        }
        
        // Create and save the user if it doesn't exist
        var user = new User({
            email : request.body.email,
            password : request.body.password,
            mobile: request.body.phonenumber
        });
        
        user.save(function (err) {
            if (err) {
                return callback(err);
            }
            email(request );
            sms(request);
            return response.status(200).send({status:200,code:'user.created',message:'User created successfully'})
        });
    });
};

exports.accountManagementPage = function (request, response) {
    response.render('account/profile', {
        title : 'Account Management'
    });
};

exports.deleteAccount = function (request, response, callback) {
    User.remove({
        _id : request.user.id
    }, function (err) {
        if (err) {
            return callback(err);
        }
        request.logout();
        request.flash('info', {
            msg : 'Your account has been deleted.'
        });
        response.redirect('/');
    });
};