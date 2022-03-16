const {sequelize} = require('../config/sequelize');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

const registerNewUser = async (req, res) => {
    try {
        const {username, password, email} = req.body
        var EnteredPassword = bcrypt.hashSync(password, 10);

        // TODO: chnage id and is_host
        let newUser = {
            username,
            email,
            is_host: false,
            password: EnteredPassword,
        }

        // check if user is already exist
        sequelize.models.users.findOne({ where: {email: email} })
        .then((user) => {
            if (user) {
                res.status(400).send("User is already exist!");
            } else {
                // create new user if not exist
                sequelize.models.users.create(newUser).then((addedNewUser) => {
                    const token = jwt.sign(addedNewUser.id, process.env.SECRET_KEY);
                    res.status(200).send({token})
                })
                .catch((err) => {
                    console.log(err)
                    return res.status(err.status || 500).send(err.errors[0].message)
                });
            }
        })
        .catch((err) => {
            console.log(err)
            return res.status(err.status || 500).send(err)
        });
    } catch(err) {
        console.log('error register user')
        res.status(err.status || 500).send("error when tring register!")
    }
}

const signIn = async (req, res) => {
    try{
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(500).send("must enter params")
        }

         // check if user is already exist
         sequelize.models.users.findOne({ where: {email: email} })
         .then((user) => {
             if (user) {
                bcrypt.compare(password, user.password, (err, result) => { //Comparing the hashed password
                    if (err) {
                        return res.status(500).send("server error")
                    } else if (result === true) { //Checking if credentials match
                        const token = jwt.sign(user.id, process.env.SECRET_KEY);
                        return res.status(200).send({token})
                    }
                    else {
                        //Declaring the errors
                        if (result != true)
                            return res.status(400).send("please enter correct password!");
                    }
                })
             } else {
                return res.status(400).send("User is not registered, Sign Up first");
             }
         })
         .catch((err) => {
             console.log(err)
         });
    } catch(err) {
        console.log('error check users')
        return res.status(err.status || 500).send("error when tring signing in!")
    }
}

const editUser = (req, res) => {

}

module.exports = { getUsersList, getUserById, registerNewUser, signIn, editUser }