import { check, validationResult } from 'express-validator';

export const userValidation = async (req) => {
    const { repeat_password } = req.body

    await check('firstName')
        .notEmpty()
        .withMessage('First name cannot be empty')
        .run(req)
    await check('lastName')
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .run(req)
    await check('email')
        .isEmail()
        .withMessage('Invalid email')
        .run(req)
    await check('password')
        .isLength({ min: 6 })
        .withMessage('Password needs minimun 6 characters')
        .equals(repeat_password)
        .withMessage('Password and repeat password must be equals')
        .run(req)

    const result = validationResult(req)
    return result
}

export const emailValidation = async (req) => {

    await check('email')
        .isEmail()
        .withMessage('Invalid email')
        .run(req)

    const result = validationResult(req)
    return result
}

export const newPassValidation = async (req) => {
    const { repeat_password } = req.body

    await check('password')
        .isLength({ min: 6 })
        .withMessage('Password needs minimun 6 characters')
        .equals(repeat_password)
        .withMessage('Password and repeat password must be equals')
        .run(req)

    const result = validationResult(req)
    return result
}

export const signInValidations = async (req) => {

    await check('email')
        .isEmail()
        .withMessage('Invalid email')
        .run(req)
    await check('password')
        .notEmpty()
        .withMessage('Password is required')
        .run(req)

    const result = validationResult(req)
    return result
}