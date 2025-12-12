import nodemailer from 'nodemailer';

export const sendAlertEmail = async (subject: string, htmlBody: string) => {
    const config = useRuntimeConfig();

    // Check config
    const host = config.smtpHost || process.env.SMTP_HOST;
    const port = config.smtpPort || process.env.SMTP_PORT || 587;
    const user = config.smtpUser || process.env.SMTP_USER;
    const pass = config.smtpPass || process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        console.warn('Email: SMTP config missing. Skipping email.');
        return false;
    }

    const transporter = nodemailer.createTransport({
        host: host as string,
        port: Number(port),
        secure: Number(port) === 465, // true for 465, false for other ports
        auth: {
            user: user as string,
            pass: pass as string,
        },
    });

    const recipients = ['ormix16@gmail.com', 'almalexyz@gmail.com'];

    try {
        const info = await transporter.sendMail({
            from: `"Xcargo Admin" <${user}>`,
            to: recipients.join(', '),
            subject: subject,
            html: htmlBody,
        });
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (e) {
        console.error('Email Send Error:', e);
        return false;
    }
};
