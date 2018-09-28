require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const sessionStore = new session.MemoryStore;

// View engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Session Middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    key: process.env.COOKIE_KEY,
    store: sessionStore,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 6000
    }
}));

// Flash Middleware
app.use(flash());

app.get('/', (req, res) => {
    res.render('home');
});

// app.post('/send', (req, res) => {

//     let output = `
//         <h1>Contact Form AGAIN.nl</h1>
//         <h2>Details:</h2>
//         <ul>
//             <li>Name: ${req.body.name}</li>
//             <li>Email: <a href="mailto:${req.body.email}">${req.body.email}</a></li>
//             <li>Subject: ${req.body.subject}</li>
//         </ul>
//         <h4 style="margin-bottom:0;">Message:</h4> 
//         <p>${req.body.msg}</p>
//     `;

//     let transporter = nodemailer.createTransport({
//         host: "smtp.sendgrid.net",
//         secure: false,
//         port: 25,
//         auth: {
//             user: process.env.SENDGRID_USER,
//             pass: process.env.SENDGRID_PASS
//         },
//         tls: {
//             rejectUnauthorized: false
//         }
//     });
    
//     let helperOptions = {
//         from: '"Contact Form AGAIN website" <curious@again.nl>',
//         to: 'wendy.dimmendaal@again.nl',
//         subject: 'Reactie contactformulier AGAIN',
//         text: 'Test 123',
//         html: output
//     };

//     // If hidden field is filled, its a spam mail and we don't send it
//     if(req.body.url === "" && req.body.url.length == 0) {
//         transporter.sendMail(helperOptions, (error, info) => {
//             if(error) {
//                 req.flash('success', 'Sorry, something went wrong. Please try again later!');
//                 res.redirect(req.get('referer') + "#contact");
//             } else {
//                 req.flash('success', 'Thanks for your message! You\'ll hear from us soon.');
//                 res.redirect(req.get('referer') + "#contact");
//             }
//         });
//     }
// })

var port = process.env.port || 3000;
app.listen(port, () => {
    console.log('Server started...');
});