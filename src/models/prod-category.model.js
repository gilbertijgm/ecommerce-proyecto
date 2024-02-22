import mongoose from 'mongoose';


export const categorysCollectionName = "categorys"; //creo el nombre de la colecion o tabla

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});



export const CategoryModel = mongoose.model(
    categorysCollectionName,
    categorySchema
);