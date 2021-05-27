var express = require('express');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

var User = require('../models/users');

var router = express.Router();
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    //res.send("Blind Spot");
    User.find({})
        .then((dish) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err => next(err)))
        .catch(err => next(err))
})

router.post('/register', async (req, res, next) => {

    const salt = await bcrypt.genSalt(11);
    const hash = await bcrypt.hash(req.body.password, salt);

    var user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
    })

    user.save((err, user) => {
        if (err) {
            res.statusCode = 500;
            res.header('Content-type', 'application/json');
            res.json({ err: err })
        }
        else {
            console.log(user)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: "registered" })
        }
    })
})

router.post('/login', async (req, res) => {
    try {
        var user = await User.findOne({ email: req.body.email }).exec()
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                res.statusCode = 200;
                res.header('Content-type', 'application/json');
                res.json({ success: true, status: "logged in succesfully" })
            }
            else {
                res.statusCode = 401;
                res.header('Content-type', 'application/json');
                res.json({ success: false, status: "Authentication unsuccesful" })
            }
        }
        else {
            res.statusCode = 401;
            res.header('Content-type', 'application/json');
            res.json({ success: false, status: "User does not exist" })
        }
    }
    catch (e) {
        console.log(e)
    }
})

module.exports = router;
