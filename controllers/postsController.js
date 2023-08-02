import debug from "debug";

import { ObjectId } from "mongodb";

import Post from "../models/post.js";

import asyncHandler from "../asyncHandler.js";

import { body, validationResult } from "express-validator";

const logger = debug("app:postsController");

export const postIndex = asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("author");

    res.render("posts/index", { title: "Posts", posts });
});

export const postShow = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/posts");

    const post = await Post.findById(id).populate("author");

    if (!post) return res.redirect("/posts");

    res.render("posts/show", { title: `Post '${post.title}'`, post });
});

export const postNew = asyncHandler(async (req, res) => {
    res.render("posts/new", { title: "New Post" });
});

export const postCreate = [
    body("title", "Post title must not be empty").trim().isLength({ min: 1 }).escape(),
    body("body").optional({ checkFalsy: true }).trim().escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const postData = {
            title: req.body.title,
            body: req.body.body || undefined,
            author: req.user.id,
        };

        const post = new Post(postData);

        if (!errors.isEmpty()) {
            res.render("posts/new", { title: "New Post", post, errors: errors.array() });
        } else {
            await post.save();

            logger(post);

            res.redirect(post.url);
        }
    }),
];

export const postEdit = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) return res.redirect("/posts");

    const post = await Post.findById(id);

    if (!post) return res.redirect("/posts");

    res.render("posts/edit", { title: `Edit Post '${post.id}'`, post });
});

export const postUpdate = [
    body("title", "Post title must not be empty").trim().isLength({ min: 1 }).escape(),
    body("body").optional({ checkFalsy: true }).trim().escape(),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.id;

        const postData = {
            title: req.body.title,
            body: req.body.body || undefined,
            author: req.user.id,
            _id: id,
        };

        if (!errors.isEmpty()) {
            const post = new Post(postData);

            res.render("posts/new", { title: "New Post", post, errors: errors.array() });
        } else {
            const post = await Post.findById(id);

            post.set(postData);

            await post.save();

            logger(post);
            res.redirect(post.url);
        }
    }),
];

export const postDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;

    await Post.findByIdAndDelete(id);

    res.redirect("/posts");
});
