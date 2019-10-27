const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./app/models/user');
const apiRoutes = require('./api');

app.set('port',process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

mongoose.connect(config.database, {
     useNewUrlParser: true,
     useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

app.set('superSecret', config.secret);

app.get('/', (req, res) => {
    res.send('Hello Hello');
});

app.post('/signup/:name/:password', (req,res)=>{
    const testUser = new User({
        name: req.params.name,
        password: req.params.password,
        admin: true
    });
    testUser.save((err)=>{
        if (err) throw err;
        console.log('User saved succesfully');
        res.send('User saved succesfully');
    })
});

//api

app.use('/api', apiRoutes);

app.listen(app.get('port'), ()=>{
    console.log('server on port ', app.get('port'))
});
