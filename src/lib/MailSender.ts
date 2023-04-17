import nodemailer from 'nodemailer';
import fs from 'fs'
import path from 'path'
export class MailSender {
    async send(to: string, subject: string, plainText: string, userName: string) {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            secure: true, // true for 465, false for other ports
            // requireTLS:true,
            auth: {
                user: "naoresponder@roletronic.com", // generated ethereal user
                pass: "2236RoletronicTb43cvm4!", // generated ethereal password
            },
        });
        console.log(path.join(__dirname, 'confirmation.html'))
        let mailBody = await fs.readFileSync(path.join(__dirname, 'confirmation.html'), 'utf-8');
        mailBody = mailBody.toString().split("${USER_NAME}").join(userName).split("${CONFIRMATION_URL}").join(`http://localhost:8080/u/validate/${to}`);
        let info = await transporter.sendMail({
            from: '"Não responder 👽" <naoresponder@roletronic.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: plainText, // plain text body
            html: mailBody, // html body
        });
        console.log(info);
        return info
    }

    async sendGeneric(to: string, subject: string, plainText: string, userName: string) {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            secure: true, // true for 465, false for other ports
            // requireTLS:true,
            auth: {
                user: "naoresponder@roletronic.com", // generated ethereal user
                pass: "2236RoletronicTb43cvm4!", // generated ethereal password
            },
        });
        let mailBody = await fs.readFileSync(path.join(__dirname, 'GenericMessage.html'), 'utf-8');
        mailBody = mailBody.toString().split("${message}").join(plainText).split("${USER_NAME}").join(userName);
        let info = await transporter.sendMail({
            from: '"Não responder 👽" <naoresponder@roletronic.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: plainText, // plain text body
            html: mailBody, // html body
        });
        console.log(info)
        return info
    }
}


// async..await is not allowed in global scope, must use a wrapper
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "bar@example.com, baz@example.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}