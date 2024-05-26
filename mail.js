import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

function sendMail(message) {
  return transport.sendMail(message);
}

function createVerificationEmail(to, verificationToken) {
  const senderEmail = process.env.SENDER_EMAIL;
  const baseUrl = process.env.BASE_URL;

  return {
    to: to.toLowerCase(),
    from: senderEmail,
    subject: "Email Verification",
    html: `To confirm your email please click on the <a href="${baseUrl}/api/users/verify/${verificationToken}">link</a>`,
    text: `To confirm your email please open the link ${baseUrl}/api/users/verify/${verificationToken}`,
  };
}

export default { sendMail, createVerificationEmail };
