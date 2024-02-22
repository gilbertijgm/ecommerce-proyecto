import mongoose from 'mongoose';


export const brandsCollectionName = "brands"; //creo el nombre de la colecion o tabla

const brandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});



export const brandModel = mongoose.model(
    brandsCollectionName,
    brandSchema
);