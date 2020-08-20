module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: "mongodb://127.0.0.1:27017/test",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    SECRET_SESSION: "qwerty123456"
}