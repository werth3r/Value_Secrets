const express = require('express');
const app = express();
const server = require("http").createServer(app);

const bodyParser = require("body-parser");
const path = require("path");
const staticAsset = require("static-asset");
const mongoose = require("./lib/mongoose");

const session = require("express-session");

const config = require("./config");
const routes = require("./routes");
const socket = require("./socket");
const store = require("./lib/sessionStore");


//Mongoose


//Socket.io
socket(server);


//Express
app.use(session({
    secret: config.SECRET_SESSION,
    resave: false,
    saveUnitilazed: false,
    store: store
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(staticAsset(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

//Routs
app.get('/', (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("registration");
});

app.get("/start", (req, res) => {
    if(!req.session.userId || !req.session.userLogin){
        res.render("banner");
    } else {
        res.render("chat");
    }
});

app.use("/api/auth/", routes.auth);
app.use("/api/upload/", routes.upload)


//Catching Errors
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.staus || 500);
    res.render("error", {
        message: err.message,
        error: config.IS_PRODUCTION ? {} : err
    });
});


//Listening
server.listen(config.PORT, (req, res) => {
    console.log("Server is running on port " + config.PORT);
});
