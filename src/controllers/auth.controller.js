import { generateToken } from "../config/jwt.js";
import { UserModel } from "../models/user.model.js";
import validator from 'validator';
import { generateRefreshToken } from './../config/refreshToken.js';
import jwt from 'jsonwebtoken';
import { validateMongoDbId } from "../utils/validateMongoDbId.js";
import { sendEmail } from "./email.controller.js";
import crypto from 'crypto';
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { CouponModel } from "../models/coupon.model.js";
import { OrderModel } from "../models/order.model.js";
import uniqid from 'uniqid';
import asyncHandler from "express-async-handler";



// Login a user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación de campos requeridos
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        // Buscar el usuario por su correo electrónico
        const findUser = await UserModel.findOne({ email });

        // Verificar si el usuario existe
        if (!findUser) {
            throw new Error('Authentication failed');
        }

        // Verificar si la contraseña coincide
        const isPasswordMatched = await findUser.isPasswordMatched(password);
        if (!isPasswordMatched) {
            throw new Error('Authentication failed');
        }

        // Generar un nuevo token de actualización y guardarlo en la base de datos
        const refreshToken = generateRefreshToken(findUser?._id);
        const updateUser = await UserModel.findByIdAndUpdate(
            findUser._id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );

        // Configurar la cookie refreshToken con atributos adicionales de seguridad
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
            /**ten en cuenta que sameSite y secure pueden causar problemas si tu aplicación utiliza subdominios o no
              está completamente configurada para HTTPS. 
              Asegúrate de que estas configuraciones sean apropiadas para tu entorno de producción. */
            sameSite: 'strict', // Prevenir ataques CSRF
            secure: true // Solo enviar la cookie en conexiones HTTPS
        });

        // Enviar una respuesta exitosa con el usuario y un token de acceso JWT
        res.json({
            _id: findUser._id,
            firstname: findUser.firstname,
            lastname: findUser.lastname,
            email: findUser.email,
            mobile: findUser.mobile,
            role: findUser.role,
            token: generateToken(findUser._id),
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error in login:', error);
        res.status(401).json({ success: false, msg: error.message });
    }
};

// Login a admin
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica si el correo electrónico y la contraseña están presentes en la solicitud
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Busca al administrador por su correo electrónico
        const findAdmin = await UserModel.findOne({ email });

        // Verifica si se encontró al administrador
        if (!findAdmin) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verifica si el usuario es un administrador
        if (findAdmin.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Verifica si la contraseña proporcionada coincide con la contraseña almacenada en la base de datos
        const isPasswordMatch = await findAdmin.isPasswordMatched(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Genera el token de acceso
        const token = generateToken(findAdmin._id);

        // Genera el token de actualización
        const refreshToken = await generateRefreshToken(findAdmin._id);

        // Actualiza el token de actualización en la base de datos
        await UserModel.findByIdAndUpdate(findAdmin._id, { refreshToken });

        // Establece la cookie del token de actualización en la respuesta
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000, // 72 horas en milisegundos
        });

        // Envía la respuesta con los datos del administrador y el token de acceso
        res.json({
            _id: findAdmin._id,
            firstname: findAdmin.firstname,
            lastname: findAdmin.lastname,
            email: findAdmin.email,
            mobile: findAdmin.mobile,
            token,
        });
    } catch (error) {
        // Maneja cualquier error y envía una respuesta de error al cliente
        console.error('Error logging in admin:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const logout = async (req, res) => {
    try {
        const cookie = req.cookies;

        // Verificar si se proporciona el token de actualización en las cookies
        if (!cookie?.refreshToken) {
            throw new Error('No Refresh Token in Cookies');
        }

        // Obtener el token de actualización de las cookies
        const refreshToken = cookie.refreshToken;

        // Buscar el usuario correspondiente en la base de datos utilizando el token de actualización
        const user = await UserModel.findOne({ refreshToken });
        if (!user) {
            // Si no se encuentra el usuario, limpiar la cookie y devolver un código de estado 204
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            return res.sendStatus(204);
        }

        // Actualizar el campo refreshToken del usuario en la base de datos
        await UserModel.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

        // Limpiar la cookie de refreshToken y enviar una respuesta con un código de estado 204
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        res.sendStatus(204);
    } catch (error) {
        // Manejo de errores
        console.error('Error in logout:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};

//handle refresh token
export const handleRefreshToken = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) console.error('No refresh token in cookie')
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await UserModel.findOne({ refreshToken });
    console.log(user)
    if (!user) console.error('No refresh token present in db or not matched')
    jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            console.error('there is something wrong with refresh token');
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken })
    })

}
// export const handleRefreshToken = async (req, res) => {
//     try {
//         const cookie = req.cookies;

//         // Verificar si se proporciona el token de actualización en las cookies
//         if (!cookie?.refreshToken) {
//             console.error('No refresh token in cookie');
//             return res.status(400).json({ success: false, msg: 'No refresh token provided' });
//         }

//         // Obtener el token de actualización de las cookies
//         const refreshToken = cookie.refreshToken;

//         // Buscar el usuario correspondiente en la base de datos utilizando el token de actualización
//         const user = await UserModel.findOne({ refreshToken });
//         if (!user) {
//             console.error('No refresh token present in db or not matched');
//             return res.status(401).json({ success: false, msg: 'Invalid refresh token' });
//         }

//         // Verificar el token de actualización
//         jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
//             if (err || user._id !== decoded.id) {
//                 console.error('There is something wrong with refresh token');
//                 return res.status(401).json({ success: false, msg: 'Invalid refresh token' });
//             }

//             // Generar un nuevo token de acceso
//             const accessToken = generateToken(user._id);
//             res.json({ accessToken });
//         });
//     } catch (error) {
//         // Manejo de errores
//         console.error('Error in handleRefreshToken:', error);
//         res.status(500).json({ success: false, msg: 'Internal server error' });
//     }
// };

export const updatePassword = async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body; // Extraer la contraseña del cuerpo de la solicitud

    try {
        const user = await UserModel.findById(_id);
        if (password) {
            user.password = password; // Asignar solo el valor de la contraseña, no todo el objeto req.body
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(400).json({ success: false, msg: 'Password is required' });
        }
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const forgotPasswordToken = async (req, res) => {
    try {
        const { email } = req.body;

        // Validar que el campo de correo electrónico esté presente y en el formato correcto
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, msg: 'Invalid email format' });
        }

        // Buscar el usuario en la base de datos por su correo electrónico
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found with this email' });
        }

        // Crear el token de restablecimiento de contraseña
        const token = await user.createPasswordResetToken();
        await user.save();

        // Construir el URL de restablecimiento de contraseña
        const resetUrl = `http://localhost:8080/api/auth/reset-password/${token}`;

        // Configurar la información para enviar el correo electrónico
        const data = {
            to: email,
            subject: "Forgot Password Link",
            html: `Hi, please follow this link to reset your password. 
            This link is valid for 10 minutes:<br><a href="${resetUrl}">Click Here</a>`
        };

        // Enviar el correo electrónico
        await sendEmail(data);

        // Devolver el token como respuesta (solo para propósitos de prueba)
        res.json({ msg: 'Password reset link sent successfully', token });
    } catch (error) {
        // Manejar errores
        console.error('Error in forgot password:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) console.error("token expired, please try again later");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
}

export const blockUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Verificar si se proporciona un ID válido antes de intentar bloquear al usuario
        if (!id) {
            return res.status(400).json({ success: false, msg: 'User ID is required' });
        }

        // Buscar al usuario por su ID y actualizar su estado a bloqueado
        const updatedUser = await UserModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });

        // Verificar si el usuario se encuentra y se ha bloqueado correctamente
        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Enviar una respuesta de éxito
        res.json({ success: true, msg: 'User blocked successfully' });
    } catch (error) {
        // Manejar errores
        console.error('Error in blockUser:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const unBlockUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Verificar si se proporciona un ID válido antes de intentar desbloquear al usuario
        if (!id) {
            return res.status(400).json({ success: false, msg: 'User ID is required' });
        }

        // Buscar al usuario por su ID y actualizar su estado a desbloqueado
        const updatedUser = await UserModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true });

        // Verificar si el usuario se encuentra y se ha desbloqueado correctamente
        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Enviar una respuesta de éxito
        res.json({ success: true, msg: 'User unblocked successfully' });
    } catch (error) {
        // Manejar errores
        console.error('Error in unBlockUser:', error);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

export const getWishList = async (req, res) => {
    try {
        const { _id } = req.user;
        const findUser = await UserModel.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (error) {

    }
}

export const userCart = async (req, res) => {
    try {
        const { cart } = req.body;
        const { _id } = req.user;
        // Verificar si el carrito está presente en la solicitud
        if (!cart || cart.length === 0) {
            return res.status(400).json({ error: 'Cart is required' });
        }

        // Buscar al usuario por su ID
        const user = await UserModel.findById(_id);

        // Verificar si se encontró al usuario
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Buscar si el usuario ya tiene un carrito existente
        const alreadyExistCart = await CartModel.findOne({ orderby: user._id });

        // Si existe un carrito, eliminarlo
        if (alreadyExistCart) {
            // await alreadyExistCart.remove();
            await CartModel.deleteOne({ _id: alreadyExistCart._id });
        }

        // Crear un array para almacenar los productos del carrito
        let products = [];

        // Iterar sobre los productos del carrito proporcionados en la solicitud
        for (let i = 0; i < cart.length; i++) {
            // Obtener detalles del producto
            const productDetails = {};
            productDetails.product = cart[i]._id;
            productDetails.count = cart[i].count;
            productDetails.color = cart[i].color;

            // Buscar el precio del producto en la base de datos
            const product = await ProductModel.findById(cart[i]._id).select("price").exec();

            // Verificar si se encontró el precio del producto
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${cart[i]._id}` });
            }

            productDetails.price = product.price;
            products.push(productDetails);
        }

        // Calcular el total del carrito
        let cartTotal = products.reduce((total, product) => {
            return total + product.price * product.count;
        }, 0);

        // Crear un nuevo carrito
        const newCart = await new CartModel({
            products,
            cartTotal,
            orderby: user._id,
        }).save();

        // Enviar una respuesta con el carrito creado
        res.status(200).json({ succcess: true, message: "cart created successfull", newCart });
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error creating user cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getUserCart = async (req, res) => {
    try {
        const { _id } = req.user;

        // Buscar el carrito del usuario por su ID
        const cart = await CartModel.findOne({ orderby: _id }).populate("products.product");

        // Verificar si se encontró el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Enviar el carrito encontrado como respuesta
        res.json(cart);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error getting user cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const emptyCart = async (req, res) => {
    try {
        const { _id } = req.user;

        // Buscar al usuario por su ID
        const user = await UserModel.findById(_id);

        // Verificar si se encontró al usuario
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Buscar y eliminar el carrito del usuario
        const cart = await CartModel.findOneAndDelete({ orderby: user._id });

        // Verificar si se encontró y eliminó el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Enviar el carrito eliminado como respuesta
        res.json(cart);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error emptying user cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const applyCoupon = async (req, res) => {
    try {
        const { _id } = req.user;
        const { coupon } = req.body;

        // Verificar si se proporcionó un cupón
        if (!coupon) {
            return res.status(400).json({ error: 'Coupon is required' });
        }

        // Buscar el cupón en la base de datos
        const validCoupon = await CouponModel.findOne({ title: coupon });

        // Verificar si se encontró el cupón
        if (!validCoupon) {
            return res.status(404).json({ error: 'Invalid coupon' });
        }

        // Buscar al usuario por su ID
        const user = await UserModel.findById(_id);

        // Verificar si se encontró al usuario
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Buscar el carrito del usuario
        const cart = await CartModel.findOne({ orderby: user._id }).populate('products.product');

        // Verificar si se encontró el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Calcular el total después del descuento del cupón
        let totalAfterDiscount = (cart.cartTotal - (cart.cartTotal * validCoupon.discount) / 100).toFixed(2);

        // Actualizar el total después del descuento en el carrito
        const updatedCart = await CartModel.findOneAndUpdate(
            { orderby: user._id },
            { totalAfterDiscount },
            { new: true }
        );

        // Enviar el total después del descuento como respuesta
        res.json(totalAfterDiscount);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error applying coupon:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const createOrder = async (req, res) => {
    try {
        const { cod, couponApplied } = req.body;
        const { _id } = req.user;

        // Verificar si se proporcionó un código de orden (cod)
        if (!cod) {
            return res.status(400).json({ error: 'COD is required' });
        }

        // Buscar al usuario por su ID
        const user = await UserModel.findById(_id);

        // Verificar si se encontró al usuario
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Buscar el carrito del usuario
        const userCart = await CartModel.findOne({ orderby: user._id });

        // Verificar si se encontró el carrito del usuario
        if (!userCart) {
            return res.status(404).json({ error: 'User cart not found' });
        }

        // Calcular el monto final del pedido
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        // Crear un nuevo pedido
        const newOrder = await new OrderModel({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: 'cod',
                amount: finalAmount,
                status: 'Cash on Delivery',
                created: Date.now(),
                currency: 'pesos',
            },
            orderby: user._id,
            orderStatus: 'Cash on Delivery',
        }).save();

        // Actualizar la cantidad y las ventas de los productos
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });

        const updated = await ProductModel.bulkWrite(update, {});

        // Enviar una respuesta con la actualización de productos
        res.json(updated);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { _id } = req.user;
        const userorders = await OrderModel.findOne({ orderby: _id }).populate("products.product").exec();

        res.json(userorders)
    } catch (error) {
        console.log(error)
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const { _id } = req.user;
        const userorders = await OrderModel.find({ orderby: _id }).populate("products.product").exec();

        res.json(userorders)
    } catch (error) {
        console.log(error)
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const updateOrderStatus = await OrderModel.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                }
            },
            { new: true }
        )
        res.json(updateOrderStatus)
    } catch (error) {
        console.log(error)
    }
}