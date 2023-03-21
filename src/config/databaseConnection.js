import mongoose from "mongoose";
mongoose.set('strictQuery', false);
// e8rmqN7lt9zgDct7 

const dbConnection = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: "restoran",
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to DB succesfully");
    }).catch((err) => {
        console.log(`DB connection err: ${err}`);
    })
}

export default dbConnection;