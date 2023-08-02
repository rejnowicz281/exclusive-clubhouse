// import rateLimit from "express-rate-limit";
import compression from "compression";
import debug from "debug";
import express from "express";
import helmet from "helmet";
import createError from "http-errors";
import methodOverride from "method-override";
import mongoose from "mongoose";

import errorHandler from "./errorHandler.js";

const app = express();

const logger = debug("app:db");

// connect to mongodb && listen for requests
const URI = process.env.MONGOD_URI || "mongodb://localhost:27017/clubhouse";

mongoose
    .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const server = app.listen(3000);

        logger("Connected to DB");
        logger(server.address());
    })
    .catch((err) => {
        logger(err);
    });

// middleware and static files
app.use(compression());
app.use(helmet());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
// app.use(
//     rateLimit({
//         windowMs: 1 * 60 * 1000, // 1 minute
//         max: 200,
//     })
// );

// routes
app.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(errorHandler);
