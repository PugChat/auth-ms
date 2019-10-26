const express = require('express');
const apiRoutes = express.Router();
const User = require('./app/models/user');
const jwt = require('jsonwebtoken');

apiRoutes.post('/signin', (req,res)=>{
    User.findOne({
        name: req.body.name
    }, (err,user)=>{
        if(err) throw err;
        if(!user){
            res.json({success: true, message: 'Authentication failed, No User'});
        }else if(user){
            if(user.password != req.body.password){
                res.json({success: false, message: 'Authentication failed, invalid password'});
            }else{
                const token = jwt.sign({user}, req.app.get('superSecret'));
                res.json({
                    success: true,
                    message: 'token',
                    token 
                });
            }
        }{

        }

    });
});

apiRoutes.use((req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token){
        jwt.verify(token, req.app.get('superSecret'),(err, decoded)=>{
            if(err){
                return res.json({
                    success: false,
                    message: 'authentication failure'
                });
            }else{
                req.decoded = decoded;
                next();
            }
        })
    }else{
        return res.status(403).send({
            success:false,
            message: 'token doesnt exist'
        })
    }
});

apiRoutes.get('/', (req,res)  => {
    res.json({
        message: 'Welcome to my APi'
    });
});

apiRoutes.get('/users', (req,res)=>{
    User.find({}, (err, users)=>{
        if(err) throw err;
            res.json({users});
    });
});

module.exports = apiRoutes;