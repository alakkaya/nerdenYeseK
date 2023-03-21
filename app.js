import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './src/config/databaseConnection.js';
import cookieParser from 'cookie-parser';

import userRoute from "./src/routers/userRoute.js"
import restaurantRoute from "./src/routers/restaurantRoute.js"
import menuRoute from "./src/routers/menuRoute.js"




dotenv.config();


//connection to db;
dbConnection();

const app = express()
const port = process.env.PORT || 5001


//static files middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//routes
app.use("/users", userRoute)
app.use("/restaurants", restaurantRoute)
app.use("/menus", menuRoute)


app.listen(port, () => {
    console.log(`Server running on port ${port} `);
})