import { MongoClient } from "mongodb";
import "dotenv/config";

// Replace the uri string with your connection string.
const uri =
    `mongodb+srv://zhaparka:${process.env.PASSWORD}@cluster0.jcqkd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db('typerGod');
        const users = database.collection('users');
        console.log(users);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);