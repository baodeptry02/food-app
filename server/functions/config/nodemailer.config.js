const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  host: 'smtp.gmail.com',
  secure: true,
  auth: {
    user: 'aqaq03122003@gmail.com',
    pass: 'lzln ihde byas ptku',
  },
});

module.exports = transporter;
