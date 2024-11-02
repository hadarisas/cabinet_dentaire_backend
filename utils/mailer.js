const nodemailer = require("nodemailer");

async function sendEmail(email, subject, body) {
  try {
    console.log("Sending emaill");
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST_ADDRESS,
      port: "465",
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_SENDER_ADDRESS,
      to: email,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error(error);
    console.log("Error sending email: " + error.message);
  }
}

module.exports = {
  sendEmail,
};
