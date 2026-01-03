
import nodemailer from "nodemailer";
import path from "path"; 
import fs from "fs";
import { fileURLToPath } from 'url';
import "dotenv/config";

const SENDER_EMAIL = process.env.AUTH_USER;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // Use true for 465 (SSL), false for other ports (like 587)
    auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS,
    },
});

 export default async function sendMail({
     recipient_email,
     subject,
     templateName,
    //  TEXT_BODY,
     variables
 }) {
     console.log(`Attempting to send mail from ${process.env.AUTH_USER} to ${recipient_email}...`);
     const __filename = fileURLToPath(import.meta.url);
     const __dirname = path.dirname(__filename);
     const templatePath = path.join(__dirname, "..", "templates", templateName);
     let html_body = fs.readFileSync(templatePath, "utf8");
     for (const key in variables) {
         html_body = html_body.replaceAll(`{{${key}}}`, variables[key]);
     }

    try {
        const mailOptions = {
            from: `Wallet app <${SENDER_EMAIL}>`, 
            to: recipient_email, 
            subject: subject,
            // text: TEXT_BODY, // Plain text body
            html: html_body,
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);

        console.log('✅ Email sent successfully!');
        console.log('Message ID: %s', info.messageId);
        if (info.response.includes('250')) {
             console.log('Server response: %s', info.response);
        }

    } catch (error) {
        console.error('❌ Error sending email:');
        console.error(error);
    }
}
