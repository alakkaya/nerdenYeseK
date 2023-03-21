import mongoose from "mongoose";

const workingDaysSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
        required: true
    },
    isOpen: {
        type: Boolean,
        required: true
    },
    openTime: {
        type: String,
        validate: {
            validator: function (v) {
                // Check if openTime is in the format HH:MM
                return /^\d{2}:\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid open time. Must be in the format HH:MM`
        }
    },
    closeTime: {
        type: String,
        validate: {
            validator: function (v) {
                // Check if closeTime is in the format HH:MM
                return /^\d{2}:\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid close time. Must be in the format HH:MM`
        }
    }
});


const restaurantSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
    },
    city: {
        type: String,
        required: true //filtreyi buradan yararlanarak yaparız.
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
        enum: ["Pizza", "Kebap", "Lahmacun", "ÇiğKöfte", "Tatlı", "Hamburger", "Sushi"],
        required: true
    },
    photos: {
        type: [String],
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
        required: true
    },
    wifi: {
        type: Boolean,
        required: true
    },
    wc: {
        type: Boolean,
        required: true
    },
    takeaway: {
        type: Boolean,
        required: true
    },
    reservation: {
        type: Boolean,
        required: true
    },
    serviceToCar: {
        type: Boolean,
        required: true
    },
    creditCard: {
        type: Boolean,
        required: true
    },
    forGroups: {
        type: Boolean,
        required: true
    },
    liveMusic: {
        type: Boolean,
        required: true
    }



}, { timestamps: true })

const Restaurant = mongoose.model("Restaurant", restaurantSchema)

export default Restaurant;



