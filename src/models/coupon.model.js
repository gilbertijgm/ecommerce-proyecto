import mongoose from 'mongoose';

export const couponsCollectionName = "coupons"; //creo el nombre de la colecion o tabla

const couponSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});



export const CouponModel = mongoose.model(
    couponsCollectionName,
    couponSchema
);