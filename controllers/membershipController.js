import debug from "debug";

import User from "../models/user.js";

const logger = debug("app:membershipController");

import { body, validationResult } from "express-validator";

import asyncHandler from "../asyncHandler.js";

export const membershipGet = (req, res) => {
    if (req.isUnauthenticated()) return res.redirect("/log-in");

    res.render("membership/form", { title: "Become a Member" });
};

export const membershipUpdate = [
    body("password", "Incorrect Password").equals("123"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("membership/form", { title: "Become a Member", errors: errors.array() });
        } else {
            await User.findByIdAndUpdate(req.user.id, { is_member: true });

            res.redirect("/");
        }
    }),
];
