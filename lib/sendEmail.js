import nodemailer from "nodemailer";

export default async function sendEmail({ options }) {

  console.log("SMTP USER:", process.env.SMTP_USER);
console.log("SMTP PASS LENGTH:", process.env.SMTP_PASS?.length);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"LinkUp" <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
}