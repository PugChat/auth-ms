const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const User = require('./app/models/user');
const apiRoutes = require('./api');
var ldap = require('ldapjs');

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
        var client = ldap.createClient({url: 'ldap://172.17.0.1:389'});
        DN = `cn=${req.params.name},dc=pugchat,dc=com,dc=co`;
        var newUser = {
            cn: req.params.name,
            sn: 'SN',
            uid: 'user',
            mail: 'user@unal.edu.co',
            objectClass: 'inetOrgPerson',
            userPassword: req.params.password
        }
        client.bind('cn=admin,dc=pugchat,dc=com,dc=co', '123', function (err) {
            if(err === null){
                console.log('adding user');
                client.add(DN,newUser, function(err) {
                    if(!err === null)console.log(err);                    
                });
                console.log('user added');
            }else{
                console.log(err);
            }
            client.unbind();
        });  
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
