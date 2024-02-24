import express from 'express';

import { authMiddleware, isAdmin } from '../../middlewares/auth.middleware.js';
import { getUserCart, userCart, emptyCart } from './../../controllers/cart/cart.controller.js';

const router = express.Router();

router
    .get("/cart", authMiddleware, getUserCart)
    .post("/add-cart", authMiddleware, userCart)
    .delete("/emptycart", authMiddleware, emptyCart)

export default router;