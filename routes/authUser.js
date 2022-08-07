import express from 'express';
import {
    signIn,
    signUpView,
    signUp,
    forgottenPassword,
    getUsers,
    confirmAccount,
    getUser,
    resetPassword,
    verifyToken,
    newPassword
} from '../controllers/userController.js';

const router = express.Router();

router.get('/sign-in', signIn)

router.get("/sign-up", signUpView)
router.post("/sign-up", signUp)

router.get("/confirm-account/:token", confirmAccount)

router.get("/users", getUsers)
router.get("/users/:id", getUser)

router.get("/forgotten-password", forgottenPassword)
router.post("/forgotten-password", resetPassword)


router.get("/forgotten-password/:token", verifyToken)
router.post("/forgotten-password/:token", newPassword)

export default router
