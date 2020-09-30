const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category")

const Article = connection.define('articles',{
    title: { 
        type: Sequelize.STRING,
            allowNull: false
     },
    subtitle: { 
        type: Sequelize.TEXT,
            allowNull: false
    },
    slug:{
         type: Sequelize.STRING,
         allowNull: false
    }, 
    body: {
         type: Sequelize.TEXT,
        allowNull: false
    },
    img:{
        type: Sequelize.TEXT
    },
    nameAuthor:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

Category.hasMany(Article); //Uma para muitos
Article.belongsTo(Category); //Uma para uma

module.exports = Article;