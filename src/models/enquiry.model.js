import mongoose from 'mongoose';


export const enquirysCollectionName = "enquirys"; //creo el nombre de la colecion o tabla

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String, required: true, trim: true
    },
    mobile: {
        type: String, required: true, trim: true
    },
    comment: {
        type: String, required: true,
    },
    status: {
        type: String,
        default: "Submitted",
        enum: ["Submitted", "In Progress", "Contacted"]
    }
}, {
    timestamps: true
});



export const enquiryModel = mongoose.model(
    enquirysCollectionName,
    enquirySchema
);