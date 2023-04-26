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
    .get(authMiddleware.verifyUserOrAdmin, userController.logout)

router
    .route("/")
    .get(authMiddleware.verifyAdmin, userController.getAllUsers)


router
    .route("/:id")
    .get(authMiddleware.verifyUserOrAdmin, userController.getAUser)
    .delete(authMiddleware.verifyUserOrAdmin, userController.deleteUser)
    .put(authMiddleware.verifyUserOrAdmin, userController.updateUser)









export default router;