import express, { request } from 'express';
import bodyParser from 'body-parser';
import {connect, getDB} from './db.js';
import {ObjectId} from 'mongodb';

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

// create new person
app.post('/users', (req, res) => {  
    const {address, WpmSum, attempts, highscore} = req.body;

    getDB()
    .collection('users')
    .insertOne({'address': address, 'WpmSum': WpmSum, 'attempts': attempts, 'highscore': highscore}, (err, result) => {
        if(err) {
            res.status(500).send({err: err});
            return;
        }
        res.status(200).send(result);
    })

});


// update person
app.put('/users/:address', (req, res) => {
    const {WpmSum, attempts, highscore} = req.body;
    const { address } = req.params;

    getDB()
    .collection('users').updateOne(
        {
            _id: new ObjectId(id),
        },
        {
            $set: {
                avg, 
                highscore
            }
        }
    )
})

// get One person

// get leaderboard by avg

// get leaderboard by highscore




app.listen(port, () => {
    console.log('Server started!');
});