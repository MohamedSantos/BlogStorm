const Sequelize = require ('sequelize')

const connection = new Sequelize('blogstormbd','bloguinho','bdminhacasaminhavida2020',{
    host: 'mysql669.umbler.com',
    dialect: 'mysql',
    timezone: "-03:00"
});



module.exports = connection;