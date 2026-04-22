import { Router } from "express";

import { healthRouter } from "./health.route";
import { authRouter } from "../modules/auth/routes/auth.routes";
import { trucksRouter } from "../modules/trucks/routes/trucks.routes";
import { menusRouter } from "../modules/menus/routes/menus.routes";
import { ordersRouter } from "../modules/orders/routes/orders.routes";
import { uploadsRouter } from "./uploads.route";
import { adminRouter } from "./admin.route";

const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/trucks", trucksRouter);
apiRouter.use("/menus", menusRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/uploads", uploadsRouter);
apiRouter.use(adminRouter);

export { apiRouter };
