import express from 'express';
import { applyCoupon, blockUser, createOrder, deleteUser, emptyCart, forgotPasswordToken, getAllOrders, getAllUser, getOrders, getUserById, getUserCart, getWishList, handleRefreshToken, login, loginAdmin, logout, registerUser, resetPassword, saveAddress, unBlockUser, updateOrderStatus, updatePassword, updateUser, userCart } from '../controllers/auth.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
    .get("/users", authMiddleware, isAdmin, getAllUser)
    .get("/users/:id", authMiddleware, isAdmin, getUserById)
    .post("/register-user", registerUser)
    .put("/update-user/:id", authMiddleware, updateUser)
    .delete("/delete-user/:id", deleteUser)
    .put("/update-address/:id", authMiddleware, saveAddress)

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