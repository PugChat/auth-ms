const express = require('express');
const apiRoutes = express.Router();
const User = require('./app/models/user');
const jwt = require('jsonwebtoken');

apiRoutes.get('/signin/:name/:password', (req,res)=>{
    User.findOne({
        name: req.params.name
    }, (err,user)=>{
        if(err) throw err;
        if(!user){
            res.status(401).send('Authentication failed, No User');
        }else if(user){
            if(user.password != req.params.password){
                res.status(401).send('Authentication failed, invalid password');
            }else{
                const token = jwt.sign({user}, req.app.get('superSecret'));
                res.send(token);
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
                return res.status(401).send({
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