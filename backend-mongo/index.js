import express, { request } from 'express';
import bodyParser from 'body-parser';
import {connect, getDB} from './db.js';

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connect();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// create new person (connect wallet)
app.post('/users', (req, res) => {  
    const {address, WpmSum, attempts, highscore, pending, img} = req.body;

    getDB()
    .collection('users')
    .insertOne({'_id': address, 'WpmSum': WpmSum, 'attempts': attempts, 'highscore': highscore, 'pending': pending, 'img': img}, (err, result) => {
        // getDB().collection('users').createIndex({'_id': address}, {unique: true});
        if (err) {
            res.status(500).json({ err: err });
            return;
        }
        res.status(200).send(result);
    })
    // .createIndex({'address': address}, {unique: true});

    
});

// upload images


// update person (every session of typing)
app.put('/users/:address', (req, res) => {
    const {WpmSum, attempts, highscore, pending, img} = req.body;
    const { address } = req.params;

    getDB()
    .collection('users').updateOne(
        {
            _id: address,
        },
        {
            $set: {
                WpmSum,
                attempts,
                highscore,
                pending,
                img
            }
        },
        (err, result) => {
            if (err) {
                res.status(500).json({ err: err });
                return;
            }
            res.status(200).send(result);
        }
    )
    
})

// get One person (each refresh, connection)
app.get('/users/:address', (req, res) => {
    const {address} = req.params;
    getDB()
    .collection('users')
    .find({_id: address})
    .toArray((err, result) => {
        if (err) {
            res.status(500).json({ err: err });
            return;
        }
        res.status(200).send(result);
    });
})


// get all users
app.get('/users', (req, res) => {
    getDB()
    .collection('users')
    .find({})
    .toArray((err, result) => {
        if (err) {
            res.status(500).json({ err: err });
            return;
        }
        res.status(200).send(result);
    });
})

// Delete one user
app.delete('/users/:address', (req, res) => {
    const {address} = req.params;
    // console.log(typeof(address));
    getDB()
    .collection('tasks')
    .deleteOne({ _id: address }, (err, result) => {
        if (err) {
            res.status(500).json({ err: err });
            return;   
        }
        res.status(200).send(result);
    });
})

// get leaderboard by highscore
app.get('/highscore', (req, res) => {
    getDB()
    .collection('users')
    .find({})
    .sort({highscore: -1})
    .toArray((err, result) => {
        if (err) {
            res.status(500).json({ err: err });
            return;
        }
        res.status(200).send(result);
    });
})

// get leaderboard by avg




app.listen(port, () => {
    console.log('Server started!');
});