import mongoose from 'mongoose';


export const ordersCollectionName = "orders"; //creo el nombre de la colecion o tabla

const orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            count: Number,
            color: String
        }
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Cash on Delivery",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered",
        ]
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
}, {
    timestamps: true
});



export const OrderModel = mongoose.model(
    ordersCollectionName,
    orderSchema
);