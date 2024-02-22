import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';
import { createCategory, deleteCategory, getAllCategory, getCategoryById, updateCategory } from '../controllers/prod-category.controller.js';


const router = express.Router();

router
    .get('/get-category', getAllCategory)
    .get('/get-category/:id', getCategoryById)
    .post('/create-category', authMiddleware, isAdmin, createCategory)
    .put('/update-category/:id', authMiddleware, isAdmin, updateCategory)
    .delete('/delete-category/:id', authMiddleware, isAdmin, deleteCategory)

    

export default router;