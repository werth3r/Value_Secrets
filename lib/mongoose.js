const mongoose = require("mongoose");
const config = require("../config");

mongoose.Promise = global.Promise;
mongoose.set("debug", config.IS_PRODUCTION);

mongoose.connection
    .on("error", (err) => {console.log(err)})
    .on("close", () => {console.log("Database connection closed")})
    .once("open", () => {
        const info = mongoose.connections[0];
        console.log("Connected to " + info.host + ":" + info.port +"/" + info.name);
    });

mongoose.connect(config.MONGO_URL, {useNewUrlParser: true, useCreateIndex: true});

module.exports = mongoose;