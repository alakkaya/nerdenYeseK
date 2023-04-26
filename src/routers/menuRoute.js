import express from "express";
import * as menuController from "../controllers/menuController.js"
import * as authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router({ mergeParams: true })


router
    .route("/createMenu/:restaurantId")
    .post(authMiddleware.verifyUserOrAdmin, menuController.createMenu)

router
    .route("/updateMenu/:id/:restaurantId")
    .put(authMiddleware.verifyUserOrAdmin, menuController.updateMenu)

router
    .route("/deleteMenu/:id/:restaurantId")
    .delete(authMiddleware.verifyUserOrAdmin, menuController.deleteMenu)

router
    .route("/")
    .get(menuController.getAllMenu)

router
    .route("/:id")
    .get(menuController.getDetailMenu)






export default router;