import User from "../models/user.js"
import { userValidation, newPassValidation, signInValidations, emailValidation } from '../helpers/validations/userValidations.js';
import { generateId, generateJWT } from '../helpers/token.js';
import { emailForgottenPassword, emailSignUp } from "../helpers/emails.js";
import bcrypt from 'bcrypt';

export const signIn = (req, res) => {
    res.render('auth/signin', {
        page: "Sign in",
        csrfToken: req.csrfToken()
    })
}

export const signUpView = (req, res) => {
    res.render('auth/signup', {
        page: "Sign up",
        csrfToken: req.csrfToken()
    })
}

export const authenticateUser = async (req, res) => {

    const resultValidations = await signInValidations(req)

    if (!resultValidations.isEmpty()) {
        return res.render('auth/signin', {
            page: "Sign in",
            errors: resultValidations.array(),
            csrfToken: req.csrfToken(),
        })
    }

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
        return res.render('auth/signin', {
            page: "Sign in",
            errors: [{ msg: 'User not found' }],
            csrfToken: req.csrfToken(),
        })
    }

    // check password
    if (!user.verifyPassword(password)) {
        return res.render('auth/signin', {
            page: "Sign in",
            errors: [{ msg: 'Email or password incorrect' }],
            csrfToken: req.csrfToken(),
        })
    }

    if (!user.confirmed) {
        return res.render('auth/signin', {
            page: "Sign in",
            errors: [{ msg: 'Your account has not yet been confirmed' }],
            csrfToken: req.csrfToken(),
        })
    }

    const token = generateJWT(user.id)

    // storage token on cookies
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true,
        // sameSite: true,
    }).redirect('/myproperties')
}

export const signUp = async (req, res) => {
    // extract data
    const { firstName, lastName, email, password } = req.body
    // validate data
    const resultValidations = await userValidation(req);

    if (!resultValidations.isEmpty()) {
        return res.render('auth/signup', {
            page: "Sign up",
            errors: resultValidations.array(),
            csrfToken: req.csrfToken(),
            user: {
                firstName,
                lastName,
                email,
            }
        })
    }

    // verify user do not exits
    const userExist = await User.findOne({ where: { email } })

    if (userExist) {
        return res.render('auth/signup', {
            page: "Sign up",
            csrfToken: req.csrfToken(),
            errors: [{ msg: "Email already in use" }],
            user: {
                firstName,
                lastName,
                email
            }
        })
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        token: generateId(),
    })

    emailSignUp({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: user.token
    })

    res.render('templates/message', {
        page: "Account created succesfully",
        message: "We send you an email, where do you can verify your account"
    })
}

export const confirmAccount = async (req, res) => {
    const { token } = req.params

    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('auth/confirmAccount', {
            page: "Error confirming Account",
            message: "Occurred an error when we try to confirm your account",
            error: true
        })
    }

    user.token = null
    user.confirmed = true
    await user.save()

    res.render('auth/confirmAccount', {
        page: "Account confirmed successfully",
        message: "Your Account has been confirmed successfully"
    })
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json({ response: users, status: 'success' })
    } catch (err) {
        console.log(err)
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.findOne({ where: { id } })
        console.log(user)
        res.json({ response: user, status: 'success' })
    } catch (err) {
        console.log(err)
    }
}

export const forgottenPassword = (req, res) => {
    res.render('auth/forgottenpassword', {
        page: "Recover Password",
        csrfToken: req.csrfToken(),
    })
}

export const resetPassword = async (req, res) => {
    const result = await emailValidation(req);

    if (!result.isEmpty()) {
        return res.render('auth/forgottenpassword', {
            page: "Recover Password",
            csrfToken: req.csrfToken(),
            errors: result.array(),
        })
    }

    // find user
    const { email } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
        return res.render('auth/forgottenpassword', {
            page: "Recover Password",
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'Email does not belong to any user' }],
        })
    }

    // generate token
    user.token = generateId();

    await user.save();

    // send email
    emailForgottenPassword({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token
    })

    // render message
    res.render('templates/message', {
        page: "Reset your password",
        message: "We send you an email, where do you can follow the instructions to reset your password"
    })
}

export const verifyToken = async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ where: { token } })

    if (!user) {
        return res.render('auth/confirmAccount', {
            page: "Reset password",
            message: "Occurred an error when we try to confirm your information",
            error: true
        })
    }

    // add form to change password
    res.render('auth/resetPassword', {
        page: 'Reset your Password',
        csrfToken: req.csrfToken()
    })
}

export const newPassword = async (req, res) => {
    // password validation
    const resValidation = await newPassValidation(req);

    if (!resValidation.isEmpty()) {
        return res.render('auth/resetPassword', {
            page: "Reset Password",
            errors: resValidation.array(),
            csrfToken: req.csrfToken(),
        })
    }

    const { token } = req.params
    const { password } = req.body

    // find user
    const user = await User.findOne({ where: { token } })

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;

    await user.save();

    res.render('auth/confirmAccount', {
        page: 'Password Reseted',
        message: 'Password reseted successfully',
    })

}
