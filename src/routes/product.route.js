import express from 'express';
import {  addToWishLists, createProduct, deleteImg, deleteProduct, getAllProduct, getProductById, rating, updateProduct, uploadImg } from '../controllers/product.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';
import { productImgResize, uploadPhoto } from '../middlewares/uploadImages.js';


const router = express.Router();

router
    .get("/products", getAllProduct)
    .get("/product/:id", getProductById)
    .post("/create-product", authMiddleware, isAdmin, createProduct)
    .put("/update-product/:id", authMiddleware, isAdmin, updateProduct)
    .put("/upload-product/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10),productImgResize,  uploadImg)
    .delete("/delete-product/:id", authMiddleware, isAdmin, deleteProduct)
    .delete("/delete-img/:id", authMiddleware, isAdmin, deleteImg)


    .put("/wishlist", authMiddleware, addToWishLists)
    .put("/rating", authMiddleware, rating)

export default router;