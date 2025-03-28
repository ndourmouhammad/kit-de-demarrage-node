const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   host:process.env.SMTP_HOST,
   port:process.env.SMTP_PORT,
   secure: false,
   requireTLS: true,
   auth:{
       user:process.env.SMTP_MAIL,
       pass:process.env.SMTP_PASSWORD
   }
});

const sendMail = async (email, subject, content) => {

    try {

        var mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: subject,
            html: content
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            }

            console.log('Mail sent ', info.messageId);
        });

    }
    catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    sendMail,
}
