require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const Recaptcha = require('express-recaptcha').Recaptcha;
const recaptcha = new Recaptcha(process.env.GOOGLE_SITE_KEY, process.env.GOOGLE_SECRET_KEY);

const app = express();

// View engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/send', recaptcha.middleware.verify, (req, res) => {

    let output = `
        <h1>Contact Form AGAIN.nl</h1>
        <h2>Details:</h2>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: <a href="mailto:${req.body.email}">${req.body.email}</a></li>
            <li>Subject: ${req.body.subject}</li>
        </ul>
        <h4 style="margin-bottom:0;">Message:</h4> 
        <p>${req.body.msg}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        secure: false,
        port: 25,
        auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    let HelperOptions = {
        from: '"Contact Form AGAIN website" <curious@again.nl>',
        to: 'wendy.dimmendaal@again.nl',
        subject: 'Reactie contactformulier AGAIN',
        text: 'Test 123',
        html: output
    };

    if(!req.recaptcha.error) {
        transporter.sendMail(HelperOptions, (err, info) => {
            if(err) {
                res.render('error', {errorMsg: err});
            }
            res.redirect('/?form=send');
        });
    } else {
        res.render('error', {errorMsg: "Something went wrong with the captcha"});
    }
})

var port = process.env.port || 3000;
app.listen(port, () => {
    console.log('Server started...');
});