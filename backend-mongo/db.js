const mongoose = require("mongoose");

const connectToDataBase = () => {
    mongoose
        .connect(
            `mongodb+srv://zhaparka:${process.env.PASSWORD}@cluster0.8tuyd.mongodb.net/?retryWrites=true&w=majority`
        )
        .then(() => {
            console.log("Succesfully connected.");
        })
        .catch((error) => {
            console.log(error);
        });
};

module.exports = connectToDataBase;