import express from "express"
import * as userController from "../controllers/userController.js"
import * as authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router
    .route("/register")
    .post(userController.createUser)


router
    .route("/login")
    .post(authMiddleware.authenticateToken, userController.loginUser)

router
    .route("/logout")
    .get(authMiddleware.verifyUserOrAdmin, userController.logout)

router
    .route("/")
    .get(authMiddleware.verifyAdmin, userController.getAllUsers)

router
    .route("/forgot-password")
    .put(userController.forgotPassword)

router
    .route("/reset-password")
    .put(userController.resetPassword)

router
    .route("/:id")
    .get(authMiddleware.verifyUserOrAdmin, userController.getAUser)
    .delete(authMiddleware.verifyUserOrAdmin, userController.deleteUser)
    .put(authMiddleware.verifyUserOrAdmin, userController.updateUser)









export default router;