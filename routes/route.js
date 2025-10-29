import { Router } from "express";
import { test } from "../controllers/controller.js";

const router = Router();

// Sample route
router.get('/', test)

export default router;