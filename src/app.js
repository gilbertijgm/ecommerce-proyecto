import express from 'express';
import dotenv from 'dotenv';
import { initMongoDB } from './config/conectionDB.js';
import userRoutes from './routes/user/user.route.js'
import authRoutes from './routes/auth/auth.route.js'
import productRoutes from './routes/product/product.route.js'
import wishlistRoutes from './routes/wishlist/wishlist.route.js'
import cartRoutes from './routes/cart/cart.route.js'
import orderRoutes from './routes/order/order.route.js'
import blogRoutes from './routes/blog/blog.route.js'
import categoryRoutes from './routes/product/prod-category.route.js'
import brandRoutes from './routes/product/brand.route.js'
import blogCatRoutes from './routes/blog/blog-category.route.js'
import couponRoutes from './routes/order/coupon.route.js'
import colorRoutes from './routes/product/color.route.js'
import enquiryRoutes from './routes/enquiry/enquiry.route.js'
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
const app = express();
// const dotenv = require('dotenv').config();
const result = dotenv.config();

//middleware
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true
// }));
app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(errorHandler);
app.use(cookieParser());

//routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/categorys', categoryRoutes)
app.use('/api/blogcat', blogCatRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/colors', colorRoutes)
app.use('/api/enquirys', enquiryRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/order', orderRoutes)

//settings
initMongoDB()
const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))