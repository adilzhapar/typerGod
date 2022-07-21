import { ObjectId, MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

const port = 8080;

const uri =
    `mongodb+srv://zhaparka:${process.env.PASSWORD}@cluster0.jcqkd.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri);
client
    .connect()
    .then(() => {
        console.log("connected!");
    })
    .catch((err) => {
        console.log(err);
    });

const getDB = client.db('typerGod');

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// create new person (connect wallet)
app.post('/users', (req, res) => {
    const { address, WpmSum, attempts, highscore, pending, img } = req.body;

    getDB
        .collection('users')
        .insertOne({ '_id': address, 'WpmSum': WpmSum, 'attempts': attempts, 'highscore': highscore, 'pending': pending, 'img': img }, (err, result) => {
            // getDB().collection('users').createIndex({'_id': address}, {unique: true});
            if (err) {
                res.status(500).json({ err: err });
                return;
            }
            res.status(200).send(result);
        })
    // .createIndex({'address': address}, {unique: true});


});



// update person (every session of typing)
app.put('/users/:address', (req, res) => {
    const { WpmSum, attempts, highscore, pending, img } = req.body;
    const { address } = req.params;

    getDB
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
    const { address } = req.params;
    getDB
        .collection('users')
        .find({ _id: address })
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
    getDB
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
    const { address } = req.params;
    // console.log(typeof(address));
    getDB
        .collection('users')
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
    getDB
        .collection('users')
        .find({})
        .sort({ highscore: -1 })
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
    console.log(`Server started at ${port}`);
});