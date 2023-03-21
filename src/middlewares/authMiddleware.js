import jwt from "jsonwebtoken"


//verify Token
const authenticateToken = async (req, res, next) => {

    const token = req.cookies.jwt
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Not authorized"
        })
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(401).json({
                success: false,
                message: "Token geçersiz"
            })
        }
        req.user = user;
        next();
    })
}


const checkUser = async (req, res, next) => {
    authenticateToken(req, res, () => {
        if (req.user.id == req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(401).json({
                success: false,
                error: "Not authorized"
            })
        }
    })
}


const verifyAdmin = async (req, res, next) => {
    authenticateToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(401).json({
                success: false,
                error: "You are not admin"
            })
        }
    })
}

const checkUserOrAdmin = async (req, res, next) => {
    authenticateToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            res.status(401).json({
                success: false,
                error: "Not authorized"
            })
        }
    })
}



export {
    authenticateToken,
    checkUser,
    verifyAdmin,
    checkUserOrAdmin
}