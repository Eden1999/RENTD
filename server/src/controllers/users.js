const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUsersList = (req, res) => {

}

const getUserById = (req, res) => {

}

const registerNewUser = (req, res) => {
    try {
        let email = "shirel@gmail.com"
        let password = "shirelronis"
        var EnteredPassword = bcrypt.hashSync(password, 10);

        // let query = buildFindQuery(req.query)

        let user = []//[{username: "", EnteredPassword}]

        // TODO: check from db
        // const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [email]) //Verifying if the user exists in the database
        // const user = data.rows;

        //TODO: check if user exist
        if (user.length === 0) {
            // TODO: sign in for real

            const token = jwt.sign({email}, process.env.SECRET_KEY);
            res.status(200).send({token})
        } else {
            res.status(400).send("User is already exist!");
        }
    } catch(err) {
        console.log('error register user')
        res.status(err.status || 500).send("error when tring register!")
    }
}

const signIn = (req, res) => {
    try{
        let email = "shirel@gmail.com"
        let password = "shirelronis"
        var EnteredPassword = bcrypt.hashSync(password, 10); //10 saltrounds

        // let query = buildFindQuery(req.query)

        let user = [{username: "", EnteredPassword}]

        // TODO: check from db
        // const data = await client.query(`SELECT * FROM users WHERE email= $1;`, [email]) //Verifying if the user exists in the database
        // const user = data.rows;

        //TODO: check if user exist
        if (user.length === 0) {
            res.status(400).send("User is not registered, Sign Up first");
        } else {
            //TODO: when register, save the hased password
            bcrypt.compare(password, user[0].EnteredPassword, (err, result) => { //Comparing the hashed password
                if (err) {
                    res.status(500).send("server error")
                } else if (result === true) { //Checking if credentials match
                    const token = jwt.sign({email}, process.env.SECRET_KEY);
                    res.status(200).send({token})
                }
                else {
                    //Declaring the errors
                    if (result != true)
                        res.status(400).json({error: "please enter correct password!",});
                }
            })
        }
    } catch(err) {
        console.log('error check users')
        res.status(err.status || 500).send("error when tring signing in!")
    }
}

const editUser = (req, res) => {

}

module.exports = { getUsersList, getUserById, registerNewUser, signIn, editUser }