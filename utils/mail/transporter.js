import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport(process.env.MAILER_URL);
