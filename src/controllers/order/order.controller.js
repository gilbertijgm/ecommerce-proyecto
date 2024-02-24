import { CartModel } from "../../models/cart/cart.model.js";
import { CouponModel } from "../../models/order/coupon.model.js";
import { OrderModel } from "../../models/order/order.model.js";
import { ProductModel } from "../../models/product/product.model.js";
import { UserModel } from "../../models/user/user.model.js";
import uniqid from 'uniqid';
import asyncHandler from 'express-async-handler';
import { validateMongoDbId } from "../../utils/validateMongoDbId.js";


export const applyCoupon = asyncHandler(async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { coupon } = req.body;

        // Verificar si se proporcionó un cupón
        if (!coupon) {
            return res.status(400).json({ error: 'Coupon is required' });
        }
        console.log(coupon)
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
        // console.error('Error applying coupon:', error);
        // res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
});


export const createOrder = asyncHandler(async (req, res, next) => {
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
        // console.error('Error creating order:', error);
        // res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
});

export const getOrders = asyncHandler(async (req, res, next) => {
    try {
        const { _id } = req.user;

        // Verificar si el ID del usuario es válido
        if (!_id) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Buscar las órdenes del usuario
        const userOrders = await OrderModel.find({ orderby: _id }).populate("products.product").exec();

        // Verificar si se encontraron órdenes
        if (!userOrders || userOrders.length === 0) {
            return res.status(404).json({ error: 'No orders found for this user' });
        }

        // Enviar las órdenes encontradas como respuesta
        res.json(userOrders);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        // console.error('Error fetching user orders:', error);
        // res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
    try {
        const { _id } = req.user;

        // Verificar si el ID del usuario es válido
        if (!_id) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        // Buscar todas las órdenes del usuario
        const userOrders = await OrderModel.find({ orderby: _id }).populate("products.product").exec();

        // Verificar si se encontraron órdenes
        if (!userOrders || userOrders.length === 0) {
            return res.status(404).json({ error: 'No orders found for this user' });
        }

        // Enviar las órdenes encontradas como respuesta
        res.json(userOrders);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        // console.error('Error fetching user orders:', error);
        // res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
});

export const updateOrderStatus = asyncHandler(async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        validateMongoDbId(id)

        // Actualizar el estado de la orden
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                "paymentIntent.status": status // Actualizar el estado en paymentIntent
            },
            { new: true }
        );

        // Verificar si se encontró y actualizó la orden
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Enviar la orden actualizada como respuesta
        res.json(updatedOrder);
    } catch (error) {
        // Manejar cualquier error y enviar una respuesta de error al cliente
        // console.error('Error updating order status:', error);
        // res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
});