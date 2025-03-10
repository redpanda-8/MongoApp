const express = require("express");
const cors = require("cors");
const cookieParser=require("cookie-parser")
require("dotenv").config();
//
const { errorHandler } = require("./middleware/errorHandler.js");
//
const connectingDB = require("./config/db.js");
//
connectingDB();
const app = express();
//
const corsOptions={
    origin: "http://127.0.0.1:5500",
    methods:["GET", "POST", "DELETE", "PUT"],
    credentials:true,
    allowedHeaders:['Content-Type', 'Authorization']
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
//
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())
//
app.use("/ads", require("./routes/adRoutes.js"));
app.use("/users", require("./routes/userRoutes.js"));
app.use("/auth",require("./routes/userRoutes.js"))
app.use("/category",require("./routes/categoryRoutes.js"))
//
app.use(errorHandler);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app

const PORT = process.env.PORT || 5051;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
