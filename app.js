const express = require('express');
const crypto = require('crypto');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const secret = require('uid');
const body = require('body-parser');
const fs = require('fs');
const app = express();
const mongoose = require('mongoose');
const port = 3000;
const multer = require('multer');


app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(body.urlencoded({
    extended: true
}));
app.use(body.json());
app.set('view engine', 'hbs');
app.use(
    session({
        secret: secret(10),
        resave: false,
        saveUninitialized: false,
        group_number: String,
        students: Array,
    })
);


var User = require('./passport.js');
//connect to mongodb

mongoose.connect('mongodb://localhost:27017/user3', {
    useNewUrlParser: true
});
///

app.use(passport.initialize());
app.use(passport.session());
app.get('/', function (req, res) {


    if (req.isAuthenticated() && req.user.type == 'admin') res.redirect('/admin');
    if (req.isAuthenticated() && req.user.type == 'lecturer') res.redirect('/lecturer');
    res.render('index');
    //if (req.isAuthenticated() && req.user.name == 'admin') res.render('admin');
});



var admin = mongoose.model('admin', {
    username: String,
    password: String,
    group_number: String,
    type: String,
    flp: String,
}, 'user');

var file_upload = mongoose.model('file', {
    name: [],
    lecturer: String,
    group_number1: String,
    group_number2: String,
    file_name: [],
    file_link: [],
    students: [],
});
app.post('/login', passport.authenticate('login', { failureRedirect: '/' }), function (req, res) {

    /* if (req.isAuthenticated()) {
 if (req.user.type == 'lecturer') {
         req.session.data = req.user.group_number;
         res.redirect('/lecturer');
 
     }
 
     if (req.user.type == 'admin') {
         res.redirect('/admin');
     }
     }
     */
    if (req.isAuthenticated()) {
        if (req.user.type == 'admin') res.redirect('/admin');
        if (req.user.type == 'lecturer') res.redirect('/lecturer');
        if (req.user.type == 'student') res.redirect('/student');
    }

});


app.get('/login', function (req, res) {
    if (req.isAuthenticated()) res.redirect('/login/' + req.user.id);
    else res.redirect('/');
});
app.get('/login/:id', function (req, res) {
    if (req.isAuthenticated()) {
        res.render('Login');
    } else res.redirect('/');
});
app.get('/user_error', function (req, res) {
    res.json('error');
})
///////////////////////////////////////////
app.get('/user_error', function (req, res) {
    res.json('error');
})
///////////////////////////////////////////


app.get('/admin', function (req, res) {
    if (req.isAuthenticated()) res.render('admin');
})



/////////////////////////////////////////////
app.get('/lecturer', function (req, res) {
    if (req.isAuthenticated()) res.render('Lecturer');
})
///////////////////////////////////////////////////
app.get('/student', function (req, res) {
    if (req.isAuthenticated()) res.render('Student');
    else res.redirect('/');
});

/////////////////////////////////////////////////////
app.post('/logout', function (req, res) {
    req.logOut();
    res.redirect('/');
});

////////////////

app.post('/admin_data', function (req, res) {

    admin.find({ type: 'lecturer' }, function (err, result) {
        res.json({ result: result });
    })
});
//////////////////////////////
app.post('/add_user', function (req, res) {

    var data = req.body.d1;

    for (var index = 0; index < req.body.len; index++) {
        if (data[index].type == 1) {
            const hash1 = crypto.createHash('sha256').update(data[index].pass).digest('hex');

            admin.findByIdAndUpdate(data[index].id, {
                username: data[index].uname,
                password: hash1,
                group_number: data[index].name,
                type: 'lecturer',
                flp: data[index].flp,
            }, {
                upsert: true,
                new: true,
                overwrite: true
            }, function (err, res) { });
        }
        else if (data[index].type == 2) admin.findByIdAndDelete(data[index].id, function (err, doc) { })
        else if (data[index].type == 3) {
            const hash2 = crypto.createHash('sha256').update(data[index].pass).digest('hex');
            admin.insertMany({
                username: data[index].uname,
                password: hash2,
                group_number: data[index].name,
                type: 'lecturer',
                flp: data[index].flp,
            }, function (err, doc) { });
        }
    }

});
/////////////////////////////////////////////////////////////////
app.post('/allow_file', function (req, res) {

    User.find({ group_number: req.body.gr }, function (err, result) {
        res.json({ result: result });

    });

})
///////////////////////////////////////////////////////////////////////
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (fs.existsSync(__dirname + '/upload')) cb(null, 'uploads/' + req.user.group_number);
        else {
            fs.mkdirSync(__dirname + '/upload');
            cb(null, 'uploads/' + req.user.group_number);
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(' ', '_'));

    }
})

var upload = multer({ storage: storage }).array('file', 2);

app.post('/upload1', upload, (req, res, next) => {
    var data = {};
    data = req.body;
    var IDs = data.IDs.toString().split(",");
    var file_path = [], file_originalname = [];
    var files = req.files;
    for (var index = 0; index < req.files.length; index++) {
        if (!req.files[0]) {
            file_originalname.push('-');
            file_path.push('-');
        }
        if (!req.files[1]) {
            file_originalname.push('-');
            file_path.push('-')
        }
        file_path.push(files[index].path.replace(' ', '_'));
        file_originalname.push(files[index].originalname.replace(' ', '_'));
    }


    file_upload.findOne({ group_number2: data.Number }, function (err, result) {
        if (!result) file_upload.insertMany({ group_number1: req.user.group_number, group_number2: data.Number, students: IDs, lecturer: req.user.flp, file_name: file_originalname, file_link: file_path }, function () { });
        if (result) file_upload.findOneAndUpdate({ group_number2: data.Number }, { $push: { students: IDs, file_name: file_originalname, file_link: file_path } }, function () { });
    })
})

app.get('/download/:name1/:name2/:name3', function (req, res) {
    if (req.isAuthenticated())
        res.download(path.join(__dirname, req.params.name1 + '/' + req.params.name2 + '/' + req.params.name3));
    else res.redirect('/');
});

app.post('/upload2', upload, (req, res, next) => {
    var files = req.files;
    var file_path = [], file_originalname = [];
    for (var index = 0; index < req.files.length; index++) {
        file_path.push(files[index].path);
        file_originalname.push(files[index].originalname);
    }
})



app.post('/logout', function (req, res) {
    mongoose.connection.close();
    req.logOut();
    res.redirect('/');
});

app.post('/data_for_student', function (req, res) {
    file_upload.findOne({ group_number2: req.user.group_number, students: { $in: req.user._id.toString() } }, function (err, data) {
        res.json({ data: data });
    })
})

app.listen(port, () => console.log(`http://localhost:${port}`));