"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trucksRouter = void 0;
const express_1 = require("express");
const authenticate_1 = require("../../../middlewares/authenticate");
const authorize_roles_1 = require("../../../middlewares/authorize-roles");
const roles_1 = require("../../../shared/constants/roles");
const async_handler_1 = require("../../../shared/utils/async-handler");
const trucks_controller_1 = require("../controllers/trucks.controller");
const trucksRouter = (0, express_1.Router)();
exports.trucksRouter = trucksRouter;
// Public discovery for guests and logged-in users.
trucksRouter.get("/discovery", (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.discover));
trucksRouter.get("/:truckId/details", (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.details));
// Protected owner/admin/customer operations.
trucksRouter.post("/", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.registerTruck));
trucksRouter.get("/mine", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER, roles_1.ROLE_CODES.ADMIN), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.listMine));
trucksRouter.get("/mine/notifications", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.listMyNotifications));
trucksRouter.get("/mine/draft", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.getMyLatestDraft));
trucksRouter.patch("/:truckId/profile", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER, roles_1.ROLE_CODES.ADMIN), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.updateProfile));
trucksRouter.patch("/:truckId/location", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER, roles_1.ROLE_CODES.ADMIN), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.updateLocation));
trucksRouter.patch("/:truckId/status", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER, roles_1.ROLE_CODES.ADMIN), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.updateStatus));
trucksRouter.get("/admin/pending", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.ADMIN), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.listPending));
trucksRouter.get("/admin/stats", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.ADMIN), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.adminStats));
trucksRouter.patch("/:truckId/admin/review", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.ADMIN), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.reviewTruckApproval));
trucksRouter.delete("/:truckId", authenticate_1.authenticate, (0, authorize_roles_1.authorizeRoles)(roles_1.ROLE_CODES.TRUCK_OWNER, roles_1.ROLE_CODES.ADMIN), (0, async_handler_1.asyncHandler)(trucks_controller_1.trucksController.remove));
