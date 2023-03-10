import mongoose from "mongoose";
import bcrypt from "bcrypt"
import validator from "validator";

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: [true, "username area is required"],
        lowercase: true,
        validate: [validator.isAlphanumeric, "Only Alphanumeric Characters"]
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email area is required"],
        unique: true,
        validate: [validator.isEmail, "Valid email is required"]
    },
    password: {
        type: String,
        required: [true, "Password area is required"],
        minlength: [6, "At least 6 characters"]
    },
    livingCity: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\+?[1-9]\d{1,14}$/   //+090eer
    },
    birthDate: {
        type: Date,
        required: true
    },
    hobbies: {
        type: String,
        max: 150
    },
    favoriteFood: {
        type: String,
        max: 50
    }
}, { timestamps: true })

userSchema.pre("save", function (next) {
    const user = this
    bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        user.password = hashedPassword;
        next()
    })
})


const User = mongoose.model("User", userSchema)

export default User;
