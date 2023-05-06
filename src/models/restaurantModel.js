import mongoose from "mongoose";
import moment from 'moment';
import 'moment/locale/tr.js';
moment.locale('tr');


const workingDaysSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
        // required: true
    },
    isOpen: {
        type: Boolean,
        // required: true
    },
    openTime: String,
    closeTime: String,
});

// Define a custom validator for workingDaysSchema
workingDaysSchema.path('isOpen').validate(function (value) {
    if (value) {
        return /^\d{2}:\d{2}$/.test(this.openTime) &&
            /^\d{2}:\d{2}$/.test(this.closeTime);
    } else {
        return !this.openTime && !this.closeTime;
    }
}, 'Invalid working day');

const restaurantSchema = new mongoose.Schema({

    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
    },
    city: {
        type: String,
        required: true //filtreyi buradan yararlanarak yaparız.
    },
    township: { //ilçe
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^\+?[1-9]\d{1,14}$/   //+0903380336159
    },
    category: {
        type: [String], //birden fazla olursa
        enum: ["Pizza", "Kebap", "Lahmacun", "Çiğ Köfte", "Tatlı", "Hamburger", "Sushi", "Döner"],
        required: true
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    workingDays: [workingDaysSchema],
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    averagePrice: {
        type: Number,
        // required: true
    },
    wifi: {
        type: Boolean,
        // required: true
    },
    wc: {
        type: Boolean,
        // required: true
    },
    takeaway: {
        type: Boolean,
        // required: true
    },
    reservation: {
        type: Boolean,
        // required: true
    },
    serviceToCar: {
        type: Boolean,
        // required: true
    },
    creditCard: {
        type: Boolean,
        // required: true
    },
    forGroups: {
        type: Boolean,
        // required: true
    },
    liveMusic: {
        type: Boolean,
        // required: true
    }



}, { timestamps: true })

const Restaurant = mongoose.model("Restaurant", restaurantSchema)

export default Restaurant;



