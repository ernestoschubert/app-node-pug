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