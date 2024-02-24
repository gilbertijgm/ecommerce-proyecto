import express from 'express';
import { authMiddleware, isAdmin } from '../../middlewares/auth.middleware.js';
import {
    createBlogCategory,
    deleteBlogCategory,
    getAllBlogCategory,
    getBlogCategoryById,
    updateBlogCategory
} from './../../controllers/blog/blog-category.controller.js';



const router = express.Router();

router
    .get('/get-blogcat', getAllBlogCategory)
    .get('/get-blogcat/:id', getBlogCategoryById)
    .post('/create-blogcat', authMiddleware, isAdmin, createBlogCategory)
    .put('/update-blogcat/:id', authMiddleware, isAdmin, updateBlogCategory)
    .delete('/delete-blogcat/:id', authMiddleware, isAdmin, deleteBlogCategory)

export default router;