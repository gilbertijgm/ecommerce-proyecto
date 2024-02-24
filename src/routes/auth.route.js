import express from 'express';
import { applyCoupon, blockUser, createOrder, emptyCart, forgotPasswordToken, getAllOrders, getOrders,  getUserCart, getWishList, handleRefreshToken, login, loginAdmin, logout, resetPassword,  unBlockUser, updateOrderStatus, updatePassword, userCart } from '../controllers/auth.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router

    .put("/block-user/:id", authMiddleware, isAdmin, blockUser)
    .put("/unblock-user/:id", authMiddleware, isAdmin, unBlockUser)

    .get("/wishlist", authMiddleware, getWishList)
    .get("/cart", authMiddleware, getUserCart)
    .post("/cart", authMiddleware, userCart)
    .delete("/emptycart", authMiddleware, emptyCart)
    .post("/cart/applycoupon", authMiddleware, applyCoupon)
    .post("/cart/create-order", authMiddleware, createOrder)
    .get("/cart-orders", authMiddleware, getOrders)
    .get("/orders", authMiddleware, getAllOrders)
    .put("/update-orders/:id", authMiddleware, isAdmin, updateOrderStatus)


    .post("/login", login)
    .post("/login-admin", loginAdmin)
    .post("/logout", logout)
    .post("/forgot-password-token", forgotPasswordToken)
    .put("/reset-password/:token", resetPassword)
    .put("/update-password", authMiddleware, updatePassword)
    .get("/refresh", handleRefreshToken);

export default router;