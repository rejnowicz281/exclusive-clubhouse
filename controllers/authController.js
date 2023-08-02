import bcrypt from "bcryptjs";
import debug from "debug";
import passport from "passport";

import User from "../models/user.js";

import asyncHandler from "../asyncHandler.js";

const logger = debug("app:authController");

export const signUpGet = (req, res) => {
    res.render("auth/sign-up", { title: "Sign Up" });
};

export const signUpPost = asyncHandler(async (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        email: req.body.email,
        password: hashedPassword,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
    });

    await user.save();

    // log in user
    req.login(user, function (err) {
        if (err) return next(err);

        res.redirect("/");
    });
});

export const logInGet = (req, res) => {
    res.render("auth/log-in", { title: "Log In" });
};

export const logInPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
});

export const logOut = (req, res) => {
    req.logout(function (err) {
        if (err) return next(err);

        res.redirect("/");
    });
};
