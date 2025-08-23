import { Router } from "express";
import { checkHealth } from "@/controllers/health.controller";

const healthRouter: Router = Router();

healthRouter.route("/").get(checkHealth);

export default healthRouter;
