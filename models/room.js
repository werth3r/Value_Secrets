const mongoose = require("../lib/mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    admin: {
        type: String,
    },
    users: {
        type: Array,
        default: []
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Room", schema);