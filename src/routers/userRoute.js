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
    .route("/logout")
    .get(authMiddleware.authenticateToken, userController.logout)

router
    .route("/")
    .get(authMiddleware.verifySiteAdmin, userController.getAllUsers)

router
    .route("/forgot-password")
    .put(userController.forgotPassword)

router
    .route("/reset-password/:resetLink")
    .put(userController.resetPassword)

router
    .route("/:id")
    .get(userController.getAUser)
    .delete(authMiddleware.authenticateToken, userController.deleteUser)
    .put(authMiddleware.authenticateToken, userController.updateUser)

router
    .route("/addFavoriteRestaurant/:restaurantId/")
    .put(userController.addFavoriteRestaurant)









export default router;