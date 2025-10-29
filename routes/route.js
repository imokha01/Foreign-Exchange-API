import { Router } from "express";
import { query } from "express-validator";
import {
  refresh, getAll, getOne, remove, status, serveImage
} from "../controllers/controller.js";

const router = Router();

// Define routes
router.get("/status", status);
router.post("/countries/refresh", refresh);
router.get("/countries", [
  query("region").optional().isString(),
  query("currency").optional().isString(),
  query("sort").optional().isIn(["gdp_desc", "gdp_asc"])
], getAll);
router.get("/countries/image", serveImage);
router.get("/countries/:name", getOne);
router.delete("/countries/:name", remove);


export default router;