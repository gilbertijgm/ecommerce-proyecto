import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';
import { createColor, deleteColor, getAllColor, getColorById, updateColor } from '../controllers/color.controller.js';

const router = express.Router();

router
    .get('/get-color', getAllColor)
    .get('/get-color/:id', getColorById)
    .post('/create-color', authMiddleware, isAdmin, createColor)
    .put('/update-color/:id', authMiddleware, isAdmin, updateColor)
    .delete('/delete-color/:id', authMiddleware, isAdmin, deleteColor)

export default router;