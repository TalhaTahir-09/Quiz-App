const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('quiz_app', 'root', 'bbd541', {
    host: 'localhost',
    dialect: 'mysql'
})
try {
    await sequelize.authenticate();
    console.log('Connected')
} catch (error) {
    console.log(error);
};
module.exports = sequelize;