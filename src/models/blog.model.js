import mongoose from 'mongoose';


export const blogsCollectionName = "blogs"; //creo el nombre de la colecion o tabla

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    dislikes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    images: [],
    author: {
        type: String,
        default: "Admin"
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});



export const BlogModel = mongoose.model(
    blogsCollectionName,
    blogSchema
);