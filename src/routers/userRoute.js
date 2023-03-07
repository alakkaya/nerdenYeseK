import express from "express"
import * as userController from "../controllers/userController.js"
import * as authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router
    .route("/register")
    .post(userController.createUser)


router
    .route("/login")
    .post(userController.loginUser)

router
    .route("/")
    .get(authMiddleware.authenticateToken, userController.getAllUsers)
    .put(authMiddleware.authenticateToken, userController.updateUser)


router
    .route("/:id")
    .get(authMiddleware.authenticateToken, userController.getAUser)
    .delete(authMiddleware.authenticateToken, userController.deleteUser)
    .put(authMiddleware.authenticateToken, userController.updateUser)









export default router;