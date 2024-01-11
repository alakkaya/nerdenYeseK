import jwt from "jsonwebtoken"


//kullanıcının login olduğunu kontrol etmek için,checkUser
const authenticateToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; //bearer kısmı ayırıp 2.kısmı alıyor.

    if (!token) return res.status(404).json({ message: 'Token bulunamadı.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token geçersiz"
            })
        }
        req.user = user;
        next();
    })
}



const verifyRestaurantAdmin = async (req, res, next) => {
    authenticateToken(req, res, next, () => {
        if (req.user.isRestaurantAdmin) {
            next()
        } else {
            return res.status(401).json({
                success: false,
                error: "You are not admin for this restaurant"
            })
        }
    })
}

const verifySiteAdmin = async (req, res, next) => {
    authenticateToken(req, res, next, () => {
        if (req.user.isSiteAdmin) {
            next()
        } else {
            return res.status(401).json({
                success: false,
                error: "You are not admin for the site"
            })
        }
    })
}





export {
    authenticateToken,
    verifySiteAdmin,
    verifyRestaurantAdmin,
}