import mongoose from 'mongoose';


export const blogCategoryCollectionName = "blogCategory"; //creo el nombre de la colecion o tabla

const blogCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});



export const blogCategoryModel = mongoose.model(
    blogCategoryCollectionName,
    blogCategorySchema
);