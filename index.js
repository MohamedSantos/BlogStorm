const express = require ("express");
const session = require("express-session")
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database.js");
const nodemailer = require("nodemailer")

const categoriesController = require("./categories/CategoriesController.js");
const articlesController = require("./articles/ArticlesController.js");
const usersController = require("./user/UserController.js")

const Article = require("./articles/Article.js");
const Category = require("./categories/Category.js");


app.set('view engine','ejs');

app.use(session({
    secret: "rhewhjetjreqjtryj", cookie:{maxage: 60000000}
}))

app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele 
    if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP 
        res.redirect(`https://${req.headers.host}${req.url}`); //Redireciona pra HTTPS 
    else //Se a requisição já é HTTPS 
        next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado 
});

app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

connection.authenticate().then(() =>{
    console.log("Conexão feita com sucesso")
}).catch((error) => {
    console.log(error)
})

app.use("/",categoriesController)
app.use("/",articlesController)
app.use("/",usersController)

let transporter = nodemailer.createTransport({
    host:"smtp.umbler.com",
    port:587,
    secure: false,
    auth:{
        user: "contato@blogstorm.com.br",
        pass: "myblog@2020"
    },
    tls: {
        rejectUnauthorized: false
    }
})


app.post("/sendEmail",(req,res) =>{
    const mailOption = {
        from: "CONTATO <contato@blogstorm.com.br>",
        to: "blogstorm91@gmail.com",
        subject:"Nome:" + req.body.nPerson +" E-mail: " + req.body.nEmail,
        text:"Texto do email",
        html: "Telefone: " + req.body.nTel + "<br>" + req.body.nMessage
    }
    transporter.sendMail(mailOption, function(err, info){
        if(err)
            console.log(err)
        else
            res.redirect("/contact");
    })
})


app.get("/", (req,res) =>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit:16,
        include:[{model: Category}]
    },
    ).then(articles =>{
        Category.findAll().then(categories =>{
            res.render("index", {articles:articles, categories:categories})
        })
    })
})

app.get("/contact",(req,res) =>{
    res.render("contact")
})

app.get("/about",(req,res) =>{
    res.render("about")
})

app.get("/:slug", (req, res) =>{
    var slug = req.params.slug
    Article.findOne({
        where:{
            slug:slug
        },
        include:[{model: Category}]
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article",{article:article, categories:categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(error =>{
        res.redirect("/")
    })
})


app.get("/category/:slug",(req,res) =>{
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug:slug
        },
        include: [{model: Article}]
    }).then( category =>{
        if(category != undefined){
            Category.findOne({where:{slug:slug}}).then(categories =>{
                res.render("category",{articles: category.articles, categories: categories})
            })
        }else{
            res.redirect("/")
        }
    }).catch(error =>{
        res.redirect("/")
    })
})


app.listen(3000, () =>{
    console.log("Servidor rodando")
})