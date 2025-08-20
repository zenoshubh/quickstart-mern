import { Router } from "express";
import { checkHealth } from "../controllers/health.controller.js";

const healthRouter = Router();

healthRouter.route("/").get(checkHealth);

export default healthRouter;
