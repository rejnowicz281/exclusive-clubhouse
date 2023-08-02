import express from "express";
import {
    postCreate,
    postDelete,
    postEdit,
    postIndex,
    postNew,
    postShow,
    postUpdate,
} from "../controllers/postsController.js";

const router = express.Router();

router.get("/", postIndex);
router.get("/new", postNew);
router.get("/:id", postShow);
router.post("/", postCreate);
router.get("/:id/edit", postEdit);
router.put("/:id", postUpdate);
router.delete("/:id", postDelete);

export default router;
