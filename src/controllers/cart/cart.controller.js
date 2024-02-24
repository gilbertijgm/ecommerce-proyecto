import { CartModel } from "../../models/cart/cart.model.js";
import { ProductModel } from "../../models/product/product.model.js";
import { UserModel } from "../../models/user/user.model.js";
import { validateMongoDbId } from "../../utils/validateMongoDbId.js";
import asyncHandler from "express-async-handler";


export const userCart = asyncHandler(async (req, res, next) => {
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
        // console.error('Error creating user cart:', error);
        // res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
})


export const getUserCart = asyncHandler(async (req, res, next) => {
    try {
        const { _id } = req.user;

        // Buscar el carrito del usuario por su ID
        const cart = await CartModel.findOne({ orderby: _id }).populate("products.product");

        // Verificar si se encontró el carrito
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Enviar el carrito encontrado como respuesta
        return res.status(200).json(cart);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        // console.error('Error getting user cart:', error);
        // res.status(500).json({ error: 'Internal server error' });
        next(error)
    }
})


export const emptyCart = asyncHandler(async (req, res, next) => {
    try {
        const { _id } = req.user;

        // Buscar al usuario por su ID
        const user = await UserModel.findById(_id);

        // Verificar si se encontró al usuario
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Buscar el carrito del usuario
        const cart = await CartModel.findOne({ orderby: user._id });

        // Verificar si se encontró el carrito del usuario
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Vaciar el carrito del usuario
        await CartModel.deleteOne({ orderby: user._id });

        // Enviar una respuesta exitosa
        res.json({ success: true, message: 'Cart emptied successfully' });
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        // console.error('Error emptying user cart:', error);
        // res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
})

