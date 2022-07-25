import User from "../models/user.js"
import userValidation from '../shared/validations/userValidations.js';
import { generateId } from '../shared/token.js';
import { emailSignUp } from "../shared/emails.js";

export const signIn = (req, res) => {
    res.render('auth/signin', {
        page: "Sign in"
    })
}

export const signUpView = (req, res) => {
    res.render('auth/signup', {
        page: "Sign up",
        csrfToken: req.csrfToken()
    })
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
        token: generateId,
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
        page: "Recover Password"
    })
}

