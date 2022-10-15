import jwt from "jsonwebtoken";
import { User } from "../models/index.js"

const protectRoute = async (req, res, next) => {

    // verify token
    const { _token } = req.cookies

    if (!_token) {
        return res.redirect('/auth/signin')
    }

    try {

        const decoded = jwt.verify(_token, process.env.JWT_SECRET_KEY)
        const user = await User.scope('removePassword').findByPk(decoded.id)

        if (user) {
            req.user = user
        } else {
            return res.redirect('/auth/signin')
        }

        return next()
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/signin')
    }

    next()
}

export default protectRoute