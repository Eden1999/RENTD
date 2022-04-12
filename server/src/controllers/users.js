const { sequelize } = require("../config/sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require('../utils/sendMail.js');
const randToken = require('rand-token');
const {hash} = require("bcrypt");

const getUsersList = (req, res) => {
  sequelize.models.users
    .findAll()
    .then((user) => {
      res.send(user).status(200);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getUserById = (req, res) => {
  const { token } = req.headers;

  const decodeId = jwt.verify(token, process.env.SECRET_KEY);

  // check if user is already exist
  sequelize.models.users
    .findOne({ where: { id: decodeId } })
    .then((user) => {
      if (user) {
        console.log(`successfuly getting user ${user.id}`);

        let modifiedUser = user.dataValues;
        delete modifiedUser.id;
        delete modifiedUser.password;

        return res.status(200).send(modifiedUser);
      } else {
        let err = "user not found";
        console.log(err);
        return res.status(500).send(err);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status || 500).send(err);
    });
};

const registerNewUser = async (req, res) => {
  try {
    const { username, password, email, isHost, photo } = req.body;
    var EnteredPassword = bcrypt.hashSync(password, 10);

    // TODO: chnage id and is_host
    let newUser = {
      username,
      email,
      is_host: isHost,
      password: EnteredPassword,
      photo,
    };

    // check if user is already exist
    sequelize.models.users
      .findOne({ where: { email: email } })
      .then((user) => {
        if (user) {
          res.status(400).send("User is already exist!");
        } else {
          // create new user if not exist
          sequelize.models.users
            .create(newUser)
            .then((addedNewUser) => {
              const token = jwt.sign(addedNewUser.id, process.env.SECRET_KEY);
              res.status(200).send({ token, user: addedNewUser });
            })
            .catch((err) => {
              console.log(err);
              return res.status(err.status || 500).send(err.errors[0].message);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(err.status || 500).send(err);
      });
  } catch (err) {
    console.log("error register user");
    res.status(err.status || 500).send("error when tring register!");
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).send("must enter params");
    }

    // check if user is already exist
    sequelize.models.users
      .findOne({ where: { email: email } })
      .then((user) => {
        if (user) {
          bcrypt.compare(password, user.password, (err, result) => {
            //Comparing the hashed password
            if (err) {
              return res.status(500).send("server error");
            } else if (result === true) {
              //Checking if credentials match
              const token = jwt.sign(user.id, process.env.SECRET_KEY);
              return res.status(200).send({ token, user });
            } else {
              //Declaring the errors
              if (result != true) return res.status(400).send("please enter correct password!");
            }
          });
        } else {
          return res.status(400).send("User is not registered, Sign Up first");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log("error check users");
    return res.status(err.status || 500).send("error when tring signing in!");
  }
};

const editUser = async ({body}, res) => {
  const { id, photo } = body;

  try {
    const user = await sequelize.models.users.findOne({ where: { id } });
    if(!user) {
      res.status(500).send(`Could not update. User with id: ${id} does not exists`)
    } else {
      user.set({ photo });
      const updatedUser = await user.save();
      res.status(200).send({user: updatedUser});
    }
  } catch (err) {
    res.status(err.status || 500).send(`Could not update. An error occurred while trying to save user with id: ${id}`);
  }
};

const resetPassword = async (req, res) => {
  console.log(req.body);
  const {email} = req.body;

  if (!email) {
    return res.status(500).send("must enter params");
  }

  let type = '';
  let message = '';

  sequelize.models.users
      .findOne({ where: { email: email } })
      .then( async (user) => {
        if (user) {
          const token = randToken.generate(20);
          const sent = sendMail(email, token);
          console.log(sent);
          if(sent !== '0') {
            user.set({ token });
            await user.save();
            const token = jwt.sign(user.id, process.env.SECRET_KEY);
            console.log(token);
            return res.status(200).send({ token, user });
            type = 'success';
            message = 'The reset password link has been sent to your email';
          } else {
            type = 'error';
            message = 'something went wrong. Please try again';
          }
        } else {
            type  = 'error';
            message = 'The email is not registered with us';
        }
      });
};

const updatePassword = async (req, res) => {
  const token = req.body.token;
  const password = req.body.password;
  sequelize.models.users.findOne({ where: { token: token}}).then((user) => {
    if(user) {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          user.set({ password: hash });
          await user.save();
        });
      });
    }
  });
}

module.exports = { getUsersList, getUserById, registerNewUser, signIn, editUser, resetPassword, updatePassword
};
