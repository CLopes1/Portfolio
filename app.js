const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

//View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (requestAnimationFrame, res) => {
    res.render('main');
});

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email Address: ${req.body.email}</li>

        <h3>Message</h3>
        <p>${req.body.message}</li>
        </ul>
    `
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'christian.alexander.lopes@gmail.com', // generated ethereal user
            pass: 'pVMs]8x9cNv6J(8cEfb?9}K.@,.]*BMEmV4kpQUQTN7i7Q8rG4' // generated ethereal password
        },
        
        tls:{
            rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Christian Lopes Portfolio" <christian.alexander.lopes@gmail.com>', // sender address
        to: 'christian.alexander.lopes@gmail.com', // list of receivers
        subject: 'Portfolio Page Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('main', {msg:'Your message was received. Thank you for your interest!'})
    });

});

app.listen(3000, () => console.log('Server started...'));