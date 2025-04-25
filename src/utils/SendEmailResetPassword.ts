import nodemailer from 'nodemailer';
import { configOptionsMailer } from '../config/mailer';

export const SendEmailResetPassword = async (to: string, subject: string, text: string, html: string) => {
    let transporter = nodemailer.createTransport(configOptionsMailer);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    };

    try {
        // Kirim email
        const info = await transporter.sendMail(mailOptions as any);
        console.log("Email terkirim: %s", info.messageId);
    } catch (error) {
        console.error("Gagal mengirim email:", error);
    }
};