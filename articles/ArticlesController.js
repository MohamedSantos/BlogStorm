const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const multer = require("multer");
const path = require("path");
const adminAuth = require("../middlewares/adminAuth");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"public/uploads/")
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage})

router.get("/admin/articles", adminAuth, (req,res) =>{
    Article.findAll({
        include:[{model: Category}]
    }).then(articles =>{
        res.render("admin/articles/index",{articles:articles})
    })
})

router.get("/admin/articles/article/:slug", adminAuth, (req, res) =>{
    var slug = req.params.slug
    Article.findOne({
        where:{
            slug:slug
        },
        include:[{model: Category}]
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("admin/articles/article",{article:article, categories:categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(error =>{
        res.redirect("/")
    })
})

router.get("/admin/articles/new", adminAuth, (req, res) =>{
    Category.findAll().then(categories => {
        res.render("admin/articles/new",{categories: categories})
    })
})

router.post("/articles/save", upload.single("img"), (req,res) =>{
    var title = req.body.title;
    var subtitle = req.body.subtitle;
    var body = req.body.body;
    var category = req.body.category;
    var nameAuthor = req.body.nameAuthor;
    var img = req.file.filename;
    var all = title,subtitle,body,category,nameAuthor,img;

    if(all != undefined){
        Article.create({
            title:title,
            subtitle:subtitle,
            body:body,
            slug:slugify(title),
            nameAuthor:nameAuthor,
            img:img,
            categoryId: category
        }).then(() =>{
            res.redirect("/admin/articles")
        })
    }
})

router.get("/admin/articles/edit/:id", adminAuth, (req,res) =>{
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/articles")
    }
    Article.findByPk(id).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit",{article:article, categories:categories})
            })
        }else{
            res.redirect("/admin/articles")
        }
    }).catch(error =>{
        res.redirect("/admin/articles")
    })
})

router.post("/articles/update", upload.single("img"), (req,res) =>{
    var id = req.body.id;
    var title = req.body.title;
    var subtitle = req.body.subtitle;
    var body = req.body.body;
    var category = req.body.category;
    var nameAuthor = req.body.nameAuthor;
    Article.update({
            title:title,
            subtitle:subtitle,
            body:body, 
            slug:slugify(title),
            nameAuthor:nameAuthor,
            categoryId: category
        },
        {
            where: 
            {id:id}
        }).then(() =>{
            res.redirect("/admin/articles")
        })
})

router.post("/articles/delete", (req,res) =>{
    var id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id:id
                }    
            }).then(()=>{
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles")
        }
    }
})

router.get("/page/:num", (req,res) =>{
    var page = req.params.num
    var offset = 0

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page)-1) * 6
    }

    Article.findAndCountAll({
        limit:6,
        offset: offset,
        order:[['id','Desc']]
    }).then(articles =>{
        var next;
        if(offset + 6 >= articles.count){
            next = false
        }else{
            next=true
        }

        var result ={
            page: parseInt(page),
            next:next,
            articles:articles
        }

        Category.findAll().then(categories =>{
            res.render("page",{result:result, categories:categories})
        })
    })
})


module.exports = router;