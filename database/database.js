const Sequelize = require ('sequelize')

const connection = new Sequelize('bloguinho','root','1234567',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});



module.exports = connection;