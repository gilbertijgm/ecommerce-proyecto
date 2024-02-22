import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, likeBlog, dislikeBlog, upload,  } from '../controllers/blog.controller.js';
import { blogImgResize, uploadPhoto } from '../middlewares/uploadImages.js';


const router = express.Router();

router
    .get('/get-blogs', getBlogs)
    .get('/get-blog/:id', getBlogById)
    .post('/create-blog', authMiddleware, isAdmin, createBlog)
    .put('/update-blog/:id', authMiddleware, isAdmin, updateBlog)
    .put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 2),blogImgResize,  upload)
    .delete('/delete-blog/:id', authMiddleware, isAdmin, deleteBlog)

    .put('/like-blog', authMiddleware, likeBlog)
    .put('/dislike-blog', authMiddleware, dislikeBlog)

export default router;