const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const paypal = require('paypal-rest-sdk');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// إعداد PayPal
paypal.configure({
    mode: 'sandbox', // استخدم "live" للإنتاج
    client_id: 'YOUR_PAYPAL_CLIENT_ID',
    client_secret: 'YOUR_PAYPAL_CLIENT_SECRET'
});

// إعداد Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'talebpac@gmail.com@gmail.com',
        pass: '123456789' // استخدم كلمة مرور التطبيق هنا
    }
});

// إرسال كود التحقق
app.post('/send-code', (req, res) => {
    const email = req.body.email;
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // كود عشوائي من 6 أرقام

    // إرسال البريد الإلكتروني
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.status(200).send({ message: 'Verification code sent', code: verificationCode });
    });
});

// الدفع عبر PayPal
app.post('/pay', (req, res) => {
    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        transactions: [{
            amount: {
                currency: 'USD',
                total: '10.00'
            },
            description: 'Payment for Hamid Shop'
        }],
        redirect_urls: {
            return_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel'
        }
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
        if (error) {
            return res.status(500).send('Error creating PayPal payment');
        }
        res.status(200).send({ forwardLink: payment.links[1].href });
    });
});

// بدء الخادم
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});