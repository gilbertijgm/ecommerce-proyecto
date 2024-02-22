import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';
import { createEnquiry, deleteEnquiry, getAllEnquiry, getEnquiryById, updateEnquiry } from '../controllers/enquiry.controller.js';

const router = express.Router();

router
    .get('/get-enquiry', getAllEnquiry)
    .get('/get-enquiry/:id', getEnquiryById)
    .post('/create-enquiry', createEnquiry)
    .put('/update-enquiry/:id', authMiddleware, updateEnquiry)
    .delete('/delete-enquiry/:id', authMiddleware, deleteEnquiry)

export default router; 