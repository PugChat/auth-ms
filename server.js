const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./app/models/user');
const apiRoutes = require('./api');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

const port = process.env.PORT || 3000;

mongoose.connect(config.database, {
     useNewUrlParser: true,
     useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

app.set('superSecret', config.secret);

app.get('/', (req, res) => {
    res.send('Hello Hello');
});

app.get('/signup/:name/:password', (req,res)=>{
    const testUser = new User({
        name: req.params.name,
        password: req.params.password,
        admin: true
    });
    testUser.save((err)=>{
        if (err) throw err;
        console.log('User saved succesfully');
        res.json({
            success: true
        });
    })
});

//api

app.use('/api', apiRoutes);


// app.post('/api/login', (req, res)=>{
//     const user = {id:3};
//     const token = jwt.sign({user}, 'my_secret_key');
//     res.json({
//         token
//     });
// });

// app.get('/api/protected', ensureToken,(req,res)=>{
//     jwt.verify(req.token, 'my_secret_key', (err, data)=>{
//         if (err){
//             res.sendStatus(403);
//         }else{
//             res.json({
//                 text: 'protected Response',
//                 data
//             });
//         }
//     });
// });

// function ensureToken(req,res,next){
//     const bearerHeader = req.headers['authorization'];
//     console.log(bearerHeader);
//     if(typeof bearerHeader != 'undefined'){
//         const bearer = bearerHeader.split(" ");
//         const bearerToken =  bearer[1];
//         req.token = bearerToken;
//         next();
//     }else{
//         res.sendStatus(403);
//     }
// }

app.listen(3000, () => {
    console.log('Server on port 3000');
});