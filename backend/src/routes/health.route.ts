import { Router } from "express";

import { ok } from "../shared/http/api-response";

const healthRouter = Router();

healthRouter.get("/health", (_req, res) => {
  res.json(ok("Service is healthy", { uptime: process.uptime() }));
});

export { healthRouter };
