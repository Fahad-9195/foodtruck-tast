import { Router } from "express";

import { authenticate } from "../../../middlewares/authenticate";
import { authorizeRoles } from "../../../middlewares/authorize-roles";
import { ROLE_CODES } from "../../../shared/constants/roles";
import { asyncHandler } from "../../../shared/utils/async-handler";
import { trucksController } from "../controllers/trucks.controller";

const trucksRouter = Router();

// Public discovery for guests and logged-in users.
trucksRouter.get("/discovery", asyncHandler(trucksController.discover));
trucksRouter.get("/:truckId/details", asyncHandler(trucksController.details));

// Protected owner/admin/customer operations.
trucksRouter.post("/", authenticate, authorizeRoles(ROLE_CODES.TRUCK_OWNER), asyncHandler(trucksController.registerTruck));
trucksRouter.get("/mine", authenticate, authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN), asyncHandler(trucksController.listMine));
trucksRouter.get(
  "/mine/notifications",
  authenticate,
  authorizeRoles(ROLE_CODES.TRUCK_OWNER),
  asyncHandler(trucksController.listMyNotifications)
);
trucksRouter.get(
  "/mine/draft",
  authenticate,
  authorizeRoles(ROLE_CODES.TRUCK_OWNER),
  asyncHandler(trucksController.getMyLatestDraft)
);
trucksRouter.patch(
  "/:truckId/profile",
  authenticate,
  authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN),
  asyncHandler(trucksController.updateProfile)
);
trucksRouter.patch(
  "/:truckId/location",
  authenticate,
  authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN),
  asyncHandler(trucksController.updateLocation)
);
trucksRouter.patch(
  "/:truckId/status",
  authenticate,
  authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN),
  asyncHandler(trucksController.updateStatus)
);

trucksRouter.get("/admin/pending", authenticate, authorizeRoles(ROLE_CODES.ADMIN), asyncHandler(trucksController.listPending));
trucksRouter.get("/admin/stats", authenticate, authorizeRoles(ROLE_CODES.ADMIN), asyncHandler(trucksController.adminStats));
trucksRouter.patch(
  "/:truckId/admin/review",
  authenticate,
  authorizeRoles(ROLE_CODES.ADMIN),
  asyncHandler(trucksController.reviewTruckApproval)
);
trucksRouter.delete(
  "/:truckId",
  authenticate,
  authorizeRoles(ROLE_CODES.TRUCK_OWNER, ROLE_CODES.ADMIN),
  asyncHandler(trucksController.remove)
);

export { trucksRouter };
