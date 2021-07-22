const mongoose = require("../lib/mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    view: {
        type: String,
        default: '/images/profile_pictures/view0.jpg'
    },
    room: {
        type: String,
        required: true,
        default: "default"
    }
    
}, {
    timestamps: true
});

schema.set("toJSON", {
    virtuals: true
})

module.exports = mongoose.model("User", schema);