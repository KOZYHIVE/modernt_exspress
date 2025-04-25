import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Memuat variabel lingkungan
dotenv.config();

// Konfigurasi untuk Nodemailer
export const configOptionsMailer = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587, // Default 587 untuk TLS
    secure: process.env.SMTP_SECURE === "true", // TLS digunakan jika `true`
    auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASSWORD || "",
    },
};

// Validasi apakah variabel lingkungan tersedia
if (!configOptionsMailer.auth.user || !configOptionsMailer.auth.pass) {
    throw new Error("SMTP_USER dan SMTP_PASSWORD harus diatur dalam .env");
}

// Fungsi untuk membuat transporter
export const createTransporter = () => {
    return nodemailer.createTransport(configOptionsMailer);
};

// Fungsi untuk mengirim email
export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
) => {
    const transporter = createTransporter();

    const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_USER, // Alamat pengirim
        to,
        subject,
        text,
        html,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", result);
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
