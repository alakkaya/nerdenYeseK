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
    .get(authMiddleware.verifyAdmin, userController.logout)

router
    .route("/")
    .get(authMiddleware.verifyAdmin, userController.getAllUsers)


router
    .route("/:id")
    .get(authMiddleware.checkUserOrAdmin, userController.getAUser)
    .delete(authMiddleware.checkUser, userController.deleteUser)
    .put(authMiddleware.checkUser, userController.updateUser)









export default router;