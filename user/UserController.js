const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get("/admin/users", adminAuth, (req,res) => {
    User.findAll().then(users => {
        res.render("admin/users/index",{users:users})
    })
})

router.get("/admin/users/new", (req,res) =>{
    res.render("admin/users/new")
})

router.post("/users/save",(req,res) =>{
    var email = req.body.email;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    User.findOne({
        where:{
            email:email
        }
    }).then(user =>{
        if(user == undefined){
            User.create({
                email:email,
                password:hash
            }).then(()=>{
                res.redirect("/admin/users")
            }).catch((error)=>{
                res.redirect("/admin/users/new")
            })
        }else{
            res.redirect("/admin/users/new");
        }
    })
})

router.get("/admin/login",(req,res) =>{
    res.render("admin/users/login")
})

router.post("/authenticate", (req,res) =>{
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where:{
            email:email
        }
    }).then(user =>{
        if(user != undefined){
            var correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user={
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    })
})

router.get("/user/logout", (req,res) =>{
    req.session.user = undefined;
    res.redirect("/admin/login")
})

module.exports = router;