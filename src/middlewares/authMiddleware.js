import User from "../models/userModel.js";
import jwt from "jsonwebtoken"


const checkUser = async (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null
                next()
            } else {
                const user = await User.findById(decodedToken.userId)
                res.locals.user = user
                next()
            }
        })
    } else {
        res.locals.user = null
        next()
    }
}

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err) => {
                if (err) {
                    console.log(err.message);
                    next()// res.redirect("/login")
                } else {
                    next()
                }
            })
        } else {
            next()// res.redirect("/login")
        }

    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Not authorized"
        })
    }
}

export {
    authenticateToken,
    checkUser
}