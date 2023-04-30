import User from "../models/userModel.js";
import dotenv from 'dotenv';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mailgun from 'mailgun-js'

dotenv.config();

const DOMAIN = "sandbox50a88326a68643edb2f834d08ec445fb.mailgun.org";
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN })

const createUser = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ success: false, message: "The email is already registered" })
        }

        const newUser = await User.create(req.body)
        return res.status(201).json({ success: true, message: "User created...", newUser })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error,
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "There is no such user"
            })
        }

        const same = await bcrypt.compare(password, user.password);

        if (same) {
            const token = createToken(user._id)
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            })
            res.status(200).json({
                success: true,
                message: "successfully logged in",
                token,
                id: user._id
            })
        } else {
            console.log(`Password doesn't match: ${password} vs ${user.password}`)
            return res.status(401).json({
                success: false,
                message: "Passwords do not match"
            })
        }
    } catch (error) {
        console.log(`Error in loginUser: ${error}`)
        return res.status(500).json({
            success: false,
            error: error.message,
        })
    }
}


//logout işlemini pagecontrollerda cookie temizleyip yapıcam: const getLogout = (req, res) => {
//   res.cookie("jwt", "", {
//        maxAge: 1  //1milisn
//    })
//    res.redirect("/")
// }


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } })
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
        if (req.params.id === req.user.id) {
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
        if (req.params.id === req.user.id) {

            const deletedUser = await User.findByIdAndDelete(req.params.id)

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

const logout = async (req, res) => {
    //Instead of the destroy session I'll clear JWT from client-side

    res.clearCookie("jwt");
    return res.status(200).json({
        success: true,
        message: "Succesfully logged out."
    })
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "User with this email does not exists." })
        }
        const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: "20m" });

        const data = {
            from: "noreply@hello.com",
            to: email,
            subject: "Password Reset Link",
            html: `
                <h2> Please click on given link to reset your password </h2>
                <p>http://localhost:5000/resetpassword/${token}</p>
            `
        }


        return user.updateOne({ resetLink: token }, function (err, success) {
            if (err) {
                return res.status(400).json({ error: "reset password link error" })
            } else {
                mg.messages().send(data, function (error, body) {
                    if (error) {
                        return res.json({
                            error: err.message
                        })
                    }
                    return res.status(200).json({ message: "Email has been sent, kindly follow the instructions." })
                })
            }
        })
    })

};


const resetPassword = async (req, res) => {
    const { resetLink, newPass } = req.body;
    if (resetLink) {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function (error, decodedData) {
            if (error) {
                return res.status(401).json({
                    error: "Incorrect token or it is expired."
                })
            }
            User.findOne({ resetLink }, async (err, user) => {
                if (err || !user) {
                    return res.status(400).json({ error: "User with this token does not exists." })
                }

                // Hash the new password
                const hashedPassword = await bcrypt.hash(newPass, 10);

                // Update the user's password and resetLink
                //user.password = hashedPassword;
                //user.resetLink = "";
                await user.updateOne({ password: hashedPassword });

                return res.status(200).json({ message: "Your password has been changed." })
            })
        })
    } else {
        return res.status(401).json({ error: "User doesn't have resetLink" })
    }
}
export {
    createUser,
    loginUser,
    getAllUsers,
    getAUser,
    deleteUser,
    updateUser,
    logout,
    forgotPassword,
    resetPassword
}