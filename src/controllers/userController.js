import User from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(201).json({ user: user._id, user })
    } catch (error) {
        let errors2 = []

        if (error.code === 11000) {
            errors2.email = "The email is already registered"
        }

        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach((key) => {
                errors2[key] = error.errors[key].message
            })
        }
        return res.status(400).json(errors2)
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        let same = false;

        if (user) {
            same = await bcrypt.compare(password, user.password)
        } else {
            return res.status(401).json({
                success: false,
                message: "There is no such an user"
            })
        }

        if (same) {
            const token = createToken(user._id)
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            })
            res.status(200).json({
                success: true,
                message: "succesfully logged in",
                token,
                id: user._id
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Passwords are not match"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        })
    }
}

//logout işlemini pagecontrollerda cookie temizleyip yapıcam: const getLogout = (req, res) => {
//   res.cookie("jwt", "", {
//        maxAge: 1  //1milisn
//    })
//    res.redirect("/")
// }


const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: res.locals.user._id } })
        res.status(200).json({ success: true, users })
        //render("users", {
        //    users,
        //    link: "users"
        //})
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        })
    }
}

const getAUser = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.params.id })
        res.status(200).json({ success: true, user })
        /*render("users", {
            user,
            link: "users"
        })*/
    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        })
    }
}


const updateUser = async (req, res) => {
    try {
        if (req.params.id === res.locals.user.id) {

            const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })

            return res.status(200).json({
                success: true,
                message: "Your account has been updated",
                updatedUser
            })
        } else {
            return res.status(403).json({
                success: false,
                message: "User don't have permission to update other user accounts"
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User couldn't updated" + error
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        if (req.params.id === res.locals.user.id) {

            const deletedUser = await User.findByIdAndRemove(req.params.id)

            return res.status(200).json({
                success: true,
                message: "Your account has been deleted",
                deletedData: deletedUser
            })
        } else {
            return res.status(403).json({
                success: false,
                message: "User don't have permission to delete other user accounts"
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Issue" + error
        })
    }
}



export {
    createUser,
    loginUser,
    getAllUsers,
    getAUser,
    deleteUser,
    updateUser
}