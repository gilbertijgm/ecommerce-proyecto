import express from 'express';
import {
    blockUser,
    forgotPasswordToken,
    handleRefreshToken,
    login,
    loginAdmin,
    logout,
    resetPassword,
    unBlockUser,
    updatePassword
} from './../../controllers/auth/auth.controller.js';
import { authMiddleware, isAdmin } from '../../middlewares/auth.middleware.js';


const router = express.Router();

router
    .post("/login", login)
    .post("/login-admin", loginAdmin)
    .post("/logout", logout)
    .post("/forgot-password-token", forgotPasswordToken)
    .put("/reset-password/:token", resetPassword)
    .put("/update-password", authMiddleware, updatePassword)
    .get("/refresh", handleRefreshToken)


    .put("/block-user/:id", authMiddleware, isAdmin, blockUser)
    .put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser)

export default router;