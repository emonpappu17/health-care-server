// utils/emailSender.ts
import nodemailer from "nodemailer";
import config from "../../../config";
// import config from "../config"; // adjust the path

const emailSender = async (email: string,
    html: string) => {
    // 1️⃣ Create transporter
    const transporter = nodemailer.createTransport({
        // host: config.email.host, // e.g., "smtp.gmail.com"
        // port: Number(config.email.port), // usually 465 (SSL) or 587 (TLS)
        // secure: config.email.secure === "true", // true for port 465, false for others
        host: "smtp.gmail.com",
        // port: 587,
        // secure: false, // Use `true` for port 465, `false` for all other port
        port: 465,        // or 587 (465 = SSL, 587 = TLS)
        secure: true,
        auth: {
            user: config.emailSender.smtp_user,// your email
            pass: config.emailSender.smtp_pass, // your email password or App Password
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    // 2️⃣ Email options
    const mailOptions = {
        from: `"PH Health Care" <${config.emailSender.smtp_user}>`,
        to: email, // list of receivers
        subject: "Reset Password Link", // Subject line
        //text: "Hello world?", // plain text body
        html, // html body
    };

    // 3️⃣ Send email
    await transporter.sendMail(mailOptions);
};

export default emailSender;
