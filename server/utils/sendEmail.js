const nodemailer = require('nodemailer');
require('dotenv').config();  // 👈 Make sure this is called

const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `AgroConnect <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `<p>${message}</p>`,
  });
};

module.exports = sendEmail;
