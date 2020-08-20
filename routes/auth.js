const express = require("express");
const router = express.Router();
const User = require("../models").User;
const bcrypt = require("bcrypt-nodejs");

function registerUser(login, nickname, password){
    
}

router.post("/register", (req, res) => {
    let login = req.body.login;
    let nickname = req.body.nickname;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    
    if(!login || !nickname || !password || !confirmPassword){
        res.json({
            status: false,
            message: "Not enougth data"
        });
    } else if(password !== confirmPassword){
        res.json({
            status: false,
            message: "passwords aren't equal"
        });
    } else if((password.length < 8 || password.length > 32)){
        res.json({
            status: false,
            message: "password's length must be from 8 to 32 symbols"
        });
    } else {
        User
        .findOne({login: login})
        .then(data => {
            if(!data){
                
                bcrypt.hash(password, null, null, (err, hash) => {
                    User
                    .create({login: login, nickname: nickname, password: hash})
                    .then((user) => {
                        console.log(user);
                        req.session.userId = user._id;
                        req.session.userLogin = user.login;
                        res.json({
                        status: true
                    });
                    })
                    .catch(err => {
                        console.error(err);
                        res.json({
                            status: false,
                            message: "Something was wrong. Try again later"
                        }); 
                    })
                })
                
            } else {
                res.json({
                    status: false,
                    message: "User is already exists"
                })
            }
        })
    }
})

router.post("/login", (req, res) => {
    let login = req.body.login, password = req.body.password;
    
    if(!login || !password){
        res.json({
            status: false,
            message: "Not enougth data"
        });
    } else {
        User
        .findOne({login: login})
        .then(user => {
            if(!user){
                res.json({status: false, message: "Unvalid user or password"});
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if(result){
                        req.session.userId = user._id;
                        req.session.userLogin = user.login;
                        res.json({status: true});
                    } else {
                        res.json({status: false, message: "Unvalid user or password"});
                    };
                })
            }
        })
        .catch(err => {
            console.error(err);
            res.json({
                status: false,
                message: "Something was wrong. Try again later"
            }); 
        });
    };
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;