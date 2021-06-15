"use strict";
const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_MAIL}>`, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
