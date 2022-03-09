const {sequelize} = require('../config/sequelize');

const getUsersList = (req, res) => {
    sequelize.models.users.findAll().then((user) => {
        res.send(user).status(200);
    })
    .catch((err) => {
        console.log(err)
    });
}

const getUserById = (req, res) => {
    
}

const registerNewUser = (req, res) => {

}

const signIn = (req, res) => {

}

const editUser = (req, res) => {

}

module.exports = { getUsersList, getUserById, registerNewUser, signIn, editUser }