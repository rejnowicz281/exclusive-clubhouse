// import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import compression from "compression";
import debug from "debug";
import express from "express";
import flash from "express-flash";
import session from "express-session";
import helmet from "helmet";
import createError from "http-errors";
import methodOverride from "method-override";
import mongoose from "mongoose";
import passport from "passport";
import localStrategy from "passport-local";

import errorHandler from "./errorHandler.js";
import User from "./models/user.js";
import authRouter from "./routes/auth.js";
import indexRouter from "./routes/index.js";
import membershipRouter from "./routes/membership.js";
import postsRouter from "./routes/posts.js";

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
app.use(flash());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(methodOverride("_method"));
// app.use(
//     rateLimit({
//         windowMs: 1 * 60 * 1000, // 1 minute
//         max: 200,
//     })
// );
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(
    new localStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) return done(null, false, { message: "Incorrect email" });

                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "Incorrect password" });
                    }
                });
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// current user
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// routes
app.use(indexRouter);
app.use(authRouter);
app.use("/membership", membershipRouter);
app.use("/posts", postsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(errorHandler);
