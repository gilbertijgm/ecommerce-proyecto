import express from 'express';
import {  getWishList, addToWishLists} from './../../controllers/wishlist/wishlist.controller.js';
import { authMiddleware, isAdmin } from '../../middlewares/auth.middleware.js';


const router = express.Router();

router
    .get("/wishlist", authMiddleware, getWishList)
    .put("/add-wishlist", authMiddleware, addToWishLists)
    
export default router;