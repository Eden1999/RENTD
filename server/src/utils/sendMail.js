const nodemailer = require('nodemailer');

module.exports = function (email, token) {
    const mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'amit0123ram@gmail.com',
        to: email,
        subject: 'Reset Password Link - RentD.com',
        html: '<p>You requested for reset password, kindly use this <a href="http://localhost:8000/reset-password?token=' + token + '">link</a> to reset your password</p>'

    };

    return mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            return 1;
        } else {
            return  0;
        }
    });
}