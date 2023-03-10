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
    city: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^\+?[1-9]\d{1,14}$/   //+090eer
    },
    category: {
        type: [String],
        enum: ["Pizza", "Kebap", "Lahmacun", "Çiğ Köfte", "Tatlı", "Hamburger", "Sushi"],
        required: true
    },
    workingDays: [workingDaysSchema],
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