import mongoose from 'mongoose';


export const colorsCollectionName = "colors"; //creo el nombre de la colecion o tabla

const colorSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});



export const colorModel = mongoose.model(
    colorsCollectionName,
    colorSchema
);