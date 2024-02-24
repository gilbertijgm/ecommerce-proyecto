import express from 'express';
import {
    applyCoupon,
    createOrder,
    getAllOrders,
    getOrders,
    updateOrderStatus,
} from './../../controllers/order/order.controller.js';
import { authMiddleware, isAdmin } from '../../middlewares/auth.middleware.js';


const router = express.Router();

router
    .post("/applycoupon", authMiddleware, applyCoupon)
    .post("/create-order", authMiddleware, createOrder)
    .get("/cart-orders", authMiddleware, getOrders)
    .get("/orders", authMiddleware, getAllOrders)
    .put("/update-orders/:id", authMiddleware, isAdmin, updateOrderStatus)

export default router;