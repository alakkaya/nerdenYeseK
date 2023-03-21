import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    products: [{
        title: { type: String, required: true },
        price: { type: Number, required: true },
        ingredients: { type: [String], required: true },
        calorie: { type: Number },
    }],

}, { timestamps: true })

const Menu = mongoose.model("Menu", menuSchema)

export default Menu;

/*
roomNumbers:[{
    number:Number,
    unavailableDates:{
        type:[Date]
    }
}]
explaining->Each room object has two properties: number and unavailableDates.
*/


//foto text star etkileşim((yorum bepenme )), date , fotolara true false ekle...

//