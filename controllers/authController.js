import bcrypt from "bcryptjs";
import debug from "debug";
import passport from "passport";

import User from "../models/user.js";

import asyncHandler from "../asyncHandler.js";

import { body, validationResult } from "express-validator";

const logger = debug("app:authController");

export const signUpGet = (req, res) => {
    res.render("auth/sign-up", { title: "Sign Up" });
};

export const signUpPost = [
    body("email")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Email must not be empty")
        .isEmail()
        .withMessage("Email must be a valid email address")
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) throw new Error("Email already in use");
            return true;
        }),
    body("password", "Password must not be empty").trim().isLength({ min: 1 }).escape(),
    body("password_confirm").custom((value, { req }) => {
        if (value !== req.body.password) throw new Error("Passwords do not match");
        return true;
    }),
    body("first_name").optional({ checkFalsy: true }).trim().escape(),
    body("last_name").optional({ checkFalsy: true }).trim().escape(),
    body("is_admin").toBoolean(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const userData = {
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.first_name || undefined,
            last_name: req.body.last_name || undefined,
            is_admin: req.body.is_admin,
        };

        const user = new User(userData);

        if (!errors.isEmpty()) {
            res.render("auth/sign-up", {
                title: "Sign Up",
                user,
                password_confirm: req.body.password_confirm,
                errors: errors.array(),
            });
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPassword;

            await user.save();

            // log in user
            req.login(user, function (err) {
                if (err) return next(err);

                res.redirect("/");
            });
        }
    }),
];

export const logInGet = (req, res) => {
    res.render("auth/log-in", { title: "Log In" });
};

export const logInPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true,
});

export const logOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err);

        res.redirect("/");
    });
};
