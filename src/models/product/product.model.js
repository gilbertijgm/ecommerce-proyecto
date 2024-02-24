import mongoose from 'mongoose';


const productsCollectionName = "products"; //creo el nombre de la colecion o tabla

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "categorys"
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
        select: false,
    },
    images: [],
    color:[],
    tags: [],
    rating: [
        {
            star: Number,
            comment: String,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users"
            }
        }
    ],
    totalRating: {
        type: String,
        default: 0
    }
}, {
    timestamps: true
});



export const ProductModel = mongoose.model(
    productsCollectionName,
    productSchema
);