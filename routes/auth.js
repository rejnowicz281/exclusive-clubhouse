import express from "express";
import { logInGet, logInPost, logOut, signUpGet, signUpPost } from "../controllers/authController.js";

const router = express.Router();

router.get("/sign-up", signUpGet);
router.post("/sign-up", signUpPost);
router.get("/log-in", logInGet);
router.post("/log-in", logInPost);
router.get("/log-out", logOut);

export default router;
