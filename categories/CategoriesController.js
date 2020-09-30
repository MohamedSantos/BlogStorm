const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/categories", adminAuth,(req, res) =>{
    Category.findAll().then(categories =>{
        res.render("admin/categories/index",{categories: categories})
    })
})

router.get("/admin/categories/new", adminAuth, (req,res) =>{
    res.render("admin/categories/new")
})

router.post("/categories/save",(req, res) =>{
    var title = req.body.title
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() =>{
            res.redirect("/admin/categories")
        })
    }
})

router.post("/categories/delete", (req, res) =>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {
                    id:id
                }
            }).then(() =>{
                res.redirect("/admin/categories")
            })
        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")
    }

})

router.get("/category", (req,res) =>{
        res.render("listCategory")
})

module.exports = router;