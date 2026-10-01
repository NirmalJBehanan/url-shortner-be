import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevo = new BrevoClient({
    apiKey: process.env.brevo_api_key,
});

export const sendRegistrationEmail = async (email, name) => {
    const result = await brevo.transactionalEmails.sendTransacEmail({
        subject: "Registration Successful",
        sender: {
            name: process.env.brevo_sender_name,
            email: process.env.brevo_sender_email,
        },
        to: [
            {
                email: email,
            },
        ],
        htmlContent:`Hello ${name}, your registration was successful!`
    });

    return result;
};

export const sendForgetMail = async (email, token) => {

    const reset = `https://generate-short-urls.netlify.app/reset-password/${token}`;

    try {
        await brevo.transactionalEmails.sendTransacEmail({

            sender: {
                name: process.env.brevo_sender_name,
                email: process.env.brevo_sender_email
            },

            to: [{ email }],

            subject: "Password Reset",

            htmlContent: `
                <h2>Password Reset</h2>
                <p>Click the link below to change your password:</p>
                <a href="${reset}">Reset Password</a>
            `
        });

        console.log("email successfully sent");

    } catch (error) {
        console.log(error.body || error);
    }
};