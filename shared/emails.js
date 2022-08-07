import nodemailer from 'nodemailer';

export const emailSignUp = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, firstName, lastName, token} = data

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirm your account in BienesRaices.com',
        text: 'Confirm your account in BienesRaices.com',
        html: `
            <p>Hi ${firstName} ${lastName}, confirm your account</p>
            <p>Your account is ready, just confirm them clicking in this link: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 8000}/auth/confirm-account/${token}">Confirm account</a></p>

            <p>If you dont create this account, ignore this message</p>
        `
    })
}

export const emailForgottenPassword = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, firstName, lastName, token} = data

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reset your password in BienesRaices.com',
        text: 'Reset your password in BienesRaices.com',
        html: `
            <p>Hi ${firstName} ${lastName}, you have requested to change your account password</p>
            <p>Click the next link to generate a new password: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 8000}/auth/forgotten-password/${token}">Reset password</a></p>

            <p>If you dont request for a password change, ignore this message</p>
        `
    })
}
