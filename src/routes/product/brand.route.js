import express from 'express';
import { authMiddleware, isAdmin } from '../../middlewares/auth.middleware.js';
import {
    createBrand,
    deleteBrand,
    getAllBrand,
    getBrandById,
    updateBrand
} from './../../controllers/product/brand.controller.js';

const router = express.Router();

router
    .get('/get-brand', getAllBrand)
    .get('/get-brand/:id', getBrandById)
    .post('/create-brand', authMiddleware, isAdmin, createBrand)
    .put('/update-brand/:id', authMiddleware, isAdmin, updateBrand)
    .delete('/delete-brand/:id', authMiddleware, isAdmin, deleteBrand)

export default router;