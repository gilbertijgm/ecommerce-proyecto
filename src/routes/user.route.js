import express from 'express';
import { getAllUser, getUserById, registerUser, updateUser, deleteUser, saveAddress } from '../controllers/user.controller.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router
    .get("/users", authMiddleware, isAdmin, getAllUser)
    .get("/users/:id", authMiddleware, isAdmin, getUserById)
    .post("/create-user", registerUser)
    .put("/update-user/:id", authMiddleware, updateUser)
    .delete("/delete-user/:id", deleteUser)
    .put("/update-address/:id", authMiddleware, saveAddress)


export default router;