import express from 'express';
import { authMiddleware, isAdmin } from '../../middlewares/auth.middleware.js';
import {
    createCoupon,
    deleteCoupon,
    getAllCoupon,
    getCouponById,
    updateCoupon
} from './../../controllers/order/coupon.controller.js';


const router = express.Router();

router
    .get("/coupons", getAllCoupon)
    .get("/coupon/:id", getCouponById)
    .post("/create-coupon", authMiddleware, isAdmin, createCoupon)
    .put("/update-coupon/:id", authMiddleware, isAdmin, updateCoupon)
    .delete("/delete-coupon/:id", authMiddleware, isAdmin, deleteCoupon)

export default router;