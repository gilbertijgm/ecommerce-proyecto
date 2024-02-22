import mongoose from 'mongoose';


export const cartsCollectionName = "carts"; //creo el nombre de la colecion o tabla

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            count: Number,
            color: String,
            price: Number,
        },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
}, {
    timestamps: true
});



export const CartModel = mongoose.model(
    cartsCollectionName,
    cartSchema
);