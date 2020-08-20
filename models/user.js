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
        requred: true
    },
    view: {
        type: Number,
        default: 0
    }
    
}, {
    timestamps: true
});

schema.set("toJSON", {
    virtuals: true
})

module.exports = mongoose.model("User", schema);