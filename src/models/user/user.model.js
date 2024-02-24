import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const usersCollectionName = "users"; //creo el nombre de la colecion o tabla

const userSchema = new mongoose.Schema({
    firstname: {
        type: String, required: true, trim: true
    },
    lastname: {
        type: String, required: true, trim: true
    },
    email: {
        type: String, required: true, unique: true, trim: true
    },
    mobile: {
        type: String, required: true, trim: true
    },
    password: {
        type: String, required: true
    },
    role: {
        type: String, default: 'user'
    },
    isBlocked: {
        type: Boolean, default: false
    },
    cart: {
        type: Array, default: [],
    },
    address: {
        type: String
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resettoken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
    return resettoken;
};

export const UserModel = mongoose.model(
    usersCollectionName,
    userSchema
);