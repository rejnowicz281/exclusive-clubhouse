import express from "express";
import { membershipGet, membershipUpdate } from "../controllers/membershipController.js";

const router = express.Router();

router.get("/", membershipGet);
router.put("/", membershipUpdate);

export default router;
