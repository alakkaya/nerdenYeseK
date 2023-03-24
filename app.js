import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './src/config/databaseConnection.js';
import cookieParser from 'cookie-parser';

import userRoute from "./src/routers/userRoute.js"
import restaurantRoute from "./src/routers/restaurantRoute.js"
import menuRoute from "./src/routers/menuRoute.js"
import commentRoute from "./src/routers/commentRoute.js"

import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

//connection to db;
dbConnection();

const app = express()
const port = process.env.PORT || 5001


//static files middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }))

//routes
app.use("/users", userRoute)
app.use("/restaurants", restaurantRoute)
app.use("/menus", menuRoute)
app.use("/comments", commentRoute)



app.listen(port, () => {
    console.log(`Server running on port ${port} `);
})