const nodemailer = require('nodemailer');

module.exports = async (email, token) => {
    const mail = nodemailer.createTransport({
        service: 'gmail',
        host: 'localhost',
        port: 587,
        requireTls: true,
        auth: {
            user: 'amit0123ram@gmail.com',
            pass: 'azcdsx1234',
        },
    });

    const mailOptions = {
        from: 'amit0123ram@gmail.com',
        to: email,
        subject: 'Reset Password Link - RentD.com',
        html: `<p>You requested for reset password, kindly use this <p> ${token} </p> to reset your password</p>`

    };

    return await mail.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error)
            return 1;
        } else {
            console.log('sent')
            return  0;
        }
    });
}