const { sequelize } = require("../config/sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');
const sendMail = require('../utils/sendMail.js');
const randToken = require('rand-token');
const { hash } = require("bcrypt");
const creditcardutils = require('creditcardutils');
const user = require("../models/user");

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

    const cleanUserObject = (user) => {
    delete user.password;
    delete user.card_number;
    delete user.token;
    delete user.card_expiration_year;
    delete user.card_expiration_month;
    return user;
};

const getUserById = (req, res) => {
    const {token} = req.headers;
    const { id } = req.params;

    // check if user is already exist
    sequelize.models.users
        .findOne({where: {id: id}})
        .then((user) => {
            if (user) {
                console.log(`successfuly getting user ${user.id}`);

                let modifiedUser = user.dataValues;
                return res.status(200).send(cleanUserObject(modifiedUser));
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
const validateCardInfo = (cardNumber, expirationMonth, expirationYear) => {
    return creditcardutils.validateCardNumber(cardNumber) && creditcardutils.validateCardExpiry(expirationMonth, expirationYear);
};
const registerNewUser = async (req, res) => {
    try {
        const { username, password, email, isHost, photo, saveCardInfo, cardNumber, expirationYear, expirationMonth } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email address cannot be empty" });
        }
        if (!username) {
            return res.status(400).send({ message: "Username cannot be empty" });
        }
        if (!password) {
            return res.status(400).send({ message: "Password cannot be empty" });
        }

        if (saveCardInfo && !validateCardInfo(cardNumber, expirationMonth, expirationYear)) {
            return res.status(400).send({ message: "Invalid credit card info" });
        }
        var hashedPassword = bcrypt.hashSync(password, 10);
        // TODO: chnage id and is_host
        let newUser = {
            username,
            email,
            is_host: isHost,
            password: hashedPassword,
            photo,
            ...saveCardInfo && {
                card_number: cardNumber.replace(/ /g, ''),
                card_expiration_year: expirationYear,
                card_expiration_month: expirationMonth
            }
        };


        // check if user is already exist
        sequelize.models.users
            .findOne({
                where: {
                    [Op.or]: [
                        { email: email },
                        { username: username }
                    ]
                }
            })
            .then((user) => {
                if (user) {
                    if (user.email == email) {
                        res.status(400).send({ message: "Email address already in use" });
                    }
                    else {
                        res.status(400).send({ message: "Username already in use" });
                    }
                } else {
                    // create new user if not exist
                    sequelize.models.users
                        .create(newUser)
                        .then((addedNewUser) => {
                            const token = jwt.sign(addedNewUser.id, process.env.SECRET_KEY);
                            res.status(200).send({ token, user: cleanUserObject(addedNewUser.dataValues) });
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
        res.status(err.status || 500).send({ message: "Internal server error during registration" });
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
                            return res.status(200).send({ token, user: cleanUserObject(user.dataValues) });
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

const shouldUpdate = (newValue, currentValue) => {
    if (isNullEmptyOrWhitespace(newValue)) return false;
    if (newValue === currentValue) return false;
    return true;
}
const isNullEmptyOrWhitespace = (value) => {
    if (value === null) return true;
    if (/^\s*$/.test(value)) return true;
    return false;
}
const isNotNullEmptyOrWhitespace = (value) => {
    return !isNullEmptyOrWhitespace(value);
}
const editUser = async (req, res) => {
    const { token } = req.headers;
    const id = jwt.verify(token, process.env.SECRET_KEY);

    const { email, username, photo, cardNumber, expirationMonth, expirationYear } = req.body;

    if ([cardNumber, expirationMonth, expirationYear].some(isNotNullEmptyOrWhitespace)
        && !validateCardInfo(cardNumber, expirationMonth, expirationYear)) {
        return res.status(400).send({ message: "Invalid credit card info" });
    }
    try {
        const user = await sequelize.models.users.findOne({ where: { id } });
        if (!user) {
            res.status(500).send({ message: `Could not update. User with id: ${id} does not exist` })
        } else {
            const valuesToUpdate = {
                ...shouldUpdate(username, user.username) && {username},
                ...shouldUpdate(email, user.email) && {email},
                ...shouldUpdate(photo, user.photo) && {photo},
                ...shouldUpdate(cardNumber, user.photo) && { card_number: cardNumber },
                ...shouldUpdate(expirationMonth, user.card_expiration_year) && { card_expiration_month: expirationMonth },
                ...shouldUpdate(expirationYear, user.card_expiration_year) && { card_expiration_year: expirationYear }
            }
            const columnNamesToUpdate = Object.keys(valuesToUpdate);
            if (columnNamesToUpdate.length === 0) return res.status(200).send({ message: `No values were updated`, updatedValues: columnNamesToUpdate });
            user.set(valuesToUpdate);
            const updatedUser = await user.save();
        
            return res.status(200).send({ message: `Successfully updated the following values: ${columnNamesToUpdate.join(', ')}`, updatedValues: columnNamesToUpdate, user: cleanUserObject(updatedUser.dataValues) });
        }
    } catch (err) {
        console.log(err);
        res.status(err.status || 500).send({ message: `Could not update. An error occurred while trying to update user with id: ${id}` });
    }
};

const resetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(500).send("must enter params");
    }

    sequelize.models.users
        .findOne({ where: { email: email } })
        .then(async (user) => {
            if (user) {
                const token = randToken.generate(20);
                const sent = await sendMail(email, token);
                if (sent !== '0') {
                    user.set({ token });
                    await user.save();
                    const resToken = jwt.sign(user.id, process.env.SECRET_KEY);
                    return res.status(200).send({ token: resToken, id: user.id });
                } else {
                    return res.status(500).send('cannot send email');
                }
            } else {
                return res.status(404).send('email is not registered with us');
            }
        });
};

const validateToken = async (req, res) => {
    const { token, id } = req.body;

    sequelize.models.users.findOne({ where: { id } }).then(async (user) => {
        if (user) {
            if (user.token === token) {
                return res.sendStatus(200);
            } else {
                return res.status(401).send('token is invalid');
            }
        } else {
            return res.status(404).send('user is not registered');
        }
    });

}

const updatePassword = async (req, res) => {
    const { id, password } = req.body;
    sequelize.models.users.findOne({ where: { id } }).then((user) => {
        if (user) {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    user.set({ password: hash });
                    await user.save();
                    return res.status(200).send('password is updated');
                });
            });
        } else {
            return res.status(500).send('error finding user');
        }
    });
};

const updateUsername = async (req, res) => {
    console.log(req.body)
    const { id, username } = req.body;
    sequelize.models.users.findOne({ where: { id } }).then(async (user) => {
        if (user) {
            user.set({ username });
            await user.save();
            return res.status(200).send('username is updated');
        } else {
            return res.status(500).send('error finding user');
        }
    });
};

const changePassword = async (req, res) => {
    // Check to see we're authorized
    const { currentPassword, newPassword, token } = req.body;
    const id = jwt.verify(token, process.env.SECRET_KEY);

    sequelize.models.users.findOne({ where: { id } }).then((user) => {
        if (user) {
            bcrypt.compare(currentPassword, user.password, (err, result) => {
                //Comparing the hashed password
                if (err) {
                    return res.status(500).send({message: "Internal server error"});
                } else if (result === true) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        bcrypt.hash(newPassword, salt, async (err, hash) => {
                            user.set({ password: hash });
                            await user.save();
                            return res.status(200).send({message: 'Password successfully updated!'});
                        });
                    });

                } else {
                    //Declaring the errors
                    return res.status(403).send({message: "The supplied (current) password is incorrect!"});
                }
            });

        } else {
            return res.status(400).send({message: 'Invalid user ID!'});
        }
    });
};
const uploadProfilePhoto = async (req, res) => {
    const { id, photo } = req.body;

    sequelize.models.users.findOne({ where: { id } }).then(async (user) => {
        if (user) {
            await user.set({ photo });
            return res.status(200).send('profile photo had been update');
        } else {
            return res.status(404).send('user is not registered');
        }
    });
}

const addWorkspaceToFavorites = async (req, res) => {
    const { workspaceId } = req.body;
    const { token } = req.headers;

    const decodeId = jwt.verify(token, process.env.SECRET_KEY);

    // check if user exists
    sequelize.models.users
        .findOne({ where: { id: decodeId } })
        .then(async (user) => {
            if (user) {
                try {
                    await user.update({
                        favorite_workspaces: sequelize.fn('array_append',
                            sequelize.col('favorite_workspaces'), workspaceId)
                    });
                    return res.status(200).send('Added to favorites successfully!');
                } catch (err) {
                    return res.status(500).send('Something went wrong! Workspace was not added to list');
                }
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
}

const RemoveWorkspaceFromFavorites = async (req, res) => {
    const { workspaceId } = req.body;
    const { token } = req.headers;

    const decodeId = jwt.verify(token, process.env.SECRET_KEY);

    // check if user exists
    sequelize.models.users
        .findOne({ where: { id: decodeId } })
        .then(async (user) => {
            if (user) {
                try {
                    await user.update({
                        favorite_workspaces: sequelize.fn('array_remove',
                            sequelize.col('favorite_workspaces'), workspaceId)
                    });
                    return res.status(200).send('Workspace was removed from favorites successfully!');
                } catch (err) {
                    return res.status(500).send('Something went wrong! Workspace was not removed from list');
                }
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
}

const getCreditCardInfo = (req, res) => {
    const { token } = req.headers;
    const id = jwt.verify(token, process.env.SECRET_KEY);
    // Check if user already exists
    sequelize.models.users
        .findOne({ where: { id: id } })
        .then((user) => {
            if (user.card_number) {
                res.status(200).send(
                    {
                        card_number: creditcardutils.formatCardNumber(user.card_number).replace(/\S(?=.{4,}$)/g, '-'),
                        expiration_month: user.card_expiration_month,
                        expiration_year: user.card_expiration_year
                    });
            } else {
                res.status(204).send();
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(err.status || 500).send(err);
        })
}

module.exports = {
    getUsersList,
    getUserById,
    registerNewUser,
    signIn,
    editUser,
    changePassword,
    resetPassword,
    updatePassword,
    validateToken,
    uploadProfilePhoto,
    updateUsername,
    addWorkspaceToFavorites,
    RemoveWorkspaceFromFavorites,
    getCreditCardInfo
};
