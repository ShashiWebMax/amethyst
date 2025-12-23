const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, you may need to "Allow Less Secure Apps" or use an App Password.
// Ideally, use a dedicated email service like SendGrid, Mailgun, or Postmark for production.
// To configure, set these env vars: firebase functions:config:set gmail.email="your-email@gmail.com" gmail.password="your-password"
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: functions.config().gmail?.email || "dummy@gmail.com",
        pass: functions.config().gmail?.password || "dummy-password",
    },
});

exports.sendContactEmail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        const { name, email, subject, message } = req.body.data || req.body;

        if (!name || !email || !message) {
            return res.status(400).send("Missing fields");
        }

        const mailOptions = {
            from: `Amethyst Global Contact <${functions.config().gmail?.email || "noreply@amethyst.lk"}>`,
            to: "info@amethyst.lk",
            subject: `New Contact Form Submission: ${subject || "No Subject"}`,
            html: `
        <h2>New Message from Amethyst Global Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <br>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
        };

        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).send({ data: { success: false, error: error.toString() } });
            }
            console.log("Email sent:", info.response);
            return res.status(200).send({ data: { success: true } });
        });
    });
});
