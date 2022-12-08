import express from 'express';
import {
    signIn,
    authenticateUser,
    logout,
    signUpView,
    signUp,
    forgottenPassword,
    getUsers,
    confirmAccount,
    getUser,
    resetPassword,
    verifyToken,
    newPassword,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/signin', signIn)
router.post('/signin', authenticateUser)

router.post('/logout', logout)

router.get("/signup", signUpView)
router.post("/signup", signUp)

router.get("/confirmaccount/:token", confirmAccount)

router.get("/users", getUsers)
router.get("/users/:id", getUser)

router.get("/forgottenpassword", forgottenPassword)
router.post("/forgottenpassword", resetPassword)


router.get("/forgottenpassword/:token", verifyToken)
router.post("/forgottenpassword/:token", newPassword)

export default router
