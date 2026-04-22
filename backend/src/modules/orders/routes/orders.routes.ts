import { Router } from "express";

import { authenticate } from "../../../middlewares/authenticate";
import { authorizeRoles } from "../../../middlewares/authorize-roles";
import { ROLE_CODES } from "../../../shared/constants/roles";
import { asyncHandler } from "../../../shared/utils/async-handler";
import { ordersController } from "../controllers/orders.controller";

const ordersRouter = Router();

ordersRouter.use(authenticate);

ordersRouter.post("/", authorizeRoles(ROLE_CODES.CUSTOMER), asyncHandler(ordersController.create));
ordersRouter.get("/mine", authorizeRoles(ROLE_CODES.CUSTOMER), asyncHandler(ordersController.listMyOrders));
ordersRouter.get("/mine/notifications", authorizeRoles(ROLE_CODES.CUSTOMER), asyncHandler(ordersController.listMyNotifications));
ordersRouter.post("/:orderId/payment", authorizeRoles(ROLE_CODES.CUSTOMER), asyncHandler(ordersController.payOrder));
ordersRouter.post("/:orderId/review", authorizeRoles(ROLE_CODES.CUSTOMER), asyncHandler(ordersController.submitReview));
ordersRouter.get(
  "/incoming",
  authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN),
  asyncHandler(ordersController.listIncoming)
);
ordersRouter.patch(
  "/:orderId/status",
  authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN),
  asyncHandler(ordersController.updateStatus)
);

export { ordersRouter };
