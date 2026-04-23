"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersService = void 0;
const http_status_codes_1 = require("http-status-codes");
const roles_1 = require("../../../shared/constants/roles");
const order_status_1 = require("../../../shared/constants/order-status");
const app_error_1 = require("../../../shared/errors/app-error");
const orders_repository_1 = require("../repositories/orders.repository");
const statusTransitionMap = {
    [order_status_1.ORDER_STATUS.PENDING]: [order_status_1.ORDER_STATUS.PREPARING, order_status_1.ORDER_STATUS.CANCELLED],
    [order_status_1.ORDER_STATUS.PREPARING]: [order_status_1.ORDER_STATUS.READY, order_status_1.ORDER_STATUS.CANCELLED],
    [order_status_1.ORDER_STATUS.READY]: [order_status_1.ORDER_STATUS.PICKED_UP],
    [order_status_1.ORDER_STATUS.PICKED_UP]: [],
    [order_status_1.ORDER_STATUS.CANCELLED]: []
};
const buildOrderNumber = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `PU-${Date.now()}-${randomSuffix}`;
};
const createOrder = async (authUser, payload) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.CUSTOMER) {
        throw new app_error_1.AppError("Only customers can place orders", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const truck = await orders_repository_1.ordersRepository.findTruckForOrder(payload.truckId);
    if (!truck) {
        throw new app_error_1.AppError("Truck not available for ordering", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    const menuItemIds = [...new Set(payload.items.map((item) => item.menuItemId))];
    const availableItems = await orders_repository_1.ordersRepository.findAvailableMenuItems(payload.truckId, menuItemIds);
    const priceById = new Map(availableItems.map((item) => [Number(item.id), Number(item.price)]));
    const missingItem = payload.items.find((item) => !priceById.has(item.menuItemId));
    if (missingItem) {
        throw new app_error_1.AppError(`Menu item ${missingItem.menuItemId} is not available`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const normalizedItems = payload.items.map((item) => {
        const unitPrice = priceById.get(item.menuItemId) ?? 0;
        const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
        return {
            ...item,
            unitPrice,
            lineTotal
        };
    });
    const subtotalAmount = Number(normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    const estimatedReadyMinutes = 15;
    const orderId = await orders_repository_1.ordersRepository.createOrderWithItems({
        customerUserId: authUser.userId,
        truckId: payload.truckId,
        orderNumber: buildOrderNumber(),
        subtotalAmount,
        totalAmount: subtotalAmount,
        estimatedReadyMinutes,
        items: normalizedItems
    });
    return { orderId, estimatedReadyMinutes, pickupOnly: true };
};
const listMyOrders = async (authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.CUSTOMER) {
        throw new app_error_1.AppError("Only customers can access customer orders", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const items = await orders_repository_1.ordersRepository.listCustomerOrders(authUser.userId);
    return { items, pickupOnly: true };
};
const listMyNotifications = async (authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.CUSTOMER) {
        throw new app_error_1.AppError("Only customers can access notifications", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const items = await orders_repository_1.ordersRepository.listCustomerOrderNotifications(authUser.userId);
    return { items };
};
const listIncomingOrders = async (authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.TRUCK_OWNER && authUser.roleCode !== roles_1.ROLE_CODES.ADMIN) {
        throw new app_error_1.AppError("Only truck owners and admins can access incoming orders", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const items = authUser.roleCode === roles_1.ROLE_CODES.ADMIN
        ? []
        : await orders_repository_1.ordersRepository.listIncomingOrdersForOwner(authUser.userId);
    return { items, pickupOnly: true };
};
const updateOrderStatus = async (orderId, nextStatus, authUser) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.TRUCK_OWNER && authUser.roleCode !== roles_1.ROLE_CODES.ADMIN) {
        throw new app_error_1.AppError("Only truck owners and admins can update order status", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const order = await orders_repository_1.ordersRepository.findOrderOwner(orderId);
    if (!order) {
        throw new app_error_1.AppError("Order not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (authUser.roleCode === roles_1.ROLE_CODES.TRUCK_OWNER && Number(order.owner_user_id) !== authUser.userId) {
        throw new app_error_1.AppError("You can only manage orders from your own truck", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const currentStatus = order.status;
    const allowedTransitions = statusTransitionMap[currentStatus];
    if (!allowedTransitions.includes(nextStatus)) {
        throw new app_error_1.AppError(`Invalid status transition from ${currentStatus} to ${nextStatus}`, http_status_codes_1.StatusCodes.CONFLICT);
    }
    await orders_repository_1.ordersRepository.updateOrderStatus(orderId, nextStatus);
    const customerMessageByStatus = {
        [order_status_1.ORDER_STATUS.PREPARING]: {
            title: "طلبك قيد التحضير",
            body: `تم بدء تجهيز طلبك رقم ${order.order_number ?? `#${orderId}`}.`
        },
        [order_status_1.ORDER_STATUS.READY]: {
            title: "طلبك جاهز للاستلام",
            body: `طلبك رقم ${order.order_number ?? `#${orderId}`} صار جاهز. تقدر تتجه للفود ترك الآن.`
        },
        [order_status_1.ORDER_STATUS.CANCELLED]: {
            title: "تم إلغاء الطلب",
            body: `تم إلغاء طلبك رقم ${order.order_number ?? `#${orderId}`}.`
        },
        [order_status_1.ORDER_STATUS.PICKED_UP]: {
            title: "تم تسليم الطلب",
            body: `تم تسجيل استلام طلبك رقم ${order.order_number ?? `#${orderId}`}. بالهناء!`
        }
    };
    const notification = customerMessageByStatus[nextStatus];
    if (notification) {
        await orders_repository_1.ordersRepository.createOrderNotification({
            userId: Number(order.customer_user_id),
            title: notification.title,
            body: notification.body,
            metadata: {
                orderId,
                truckId: Number(order.truck_id),
                status: nextStatus
            }
        });
    }
    return { orderId, status: nextStatus, pickupOnly: true };
};
const createOrderReview = async (authUser, orderId, payload) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.CUSTOMER) {
        throw new app_error_1.AppError("Only customers can submit order reviews", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const order = await orders_repository_1.ordersRepository.findCustomerOrderById(orderId, authUser.userId);
    if (!order) {
        throw new app_error_1.AppError("Order not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (order.status !== order_status_1.ORDER_STATUS.PICKED_UP) {
        throw new app_error_1.AppError("Review is only available for completed pickup orders", http_status_codes_1.StatusCodes.CONFLICT);
    }
    const existingReview = await orders_repository_1.ordersRepository.findReviewByOrderAndUser(orderId, authUser.userId);
    if (existingReview) {
        throw new app_error_1.AppError("You already reviewed this order", http_status_codes_1.StatusCodes.CONFLICT);
    }
    const reviewId = await orders_repository_1.ordersRepository.createReviewForOrder({
        userId: authUser.userId,
        truckId: Number(order.truck_id),
        orderId: Number(order.id),
        rating: payload.rating,
        comment: payload.comment
    });
    const aggregate = await orders_repository_1.ordersRepository.getTruckReviewAggregate(Number(order.truck_id));
    await orders_repository_1.ordersRepository.updateTruckRatingAggregate(Number(order.truck_id), aggregate);
    return {
        reviewId,
        orderId: Number(order.id),
        rating: payload.rating,
        comment: payload.comment?.trim() || null
    };
};
const mapPaymentStorage = (method) => {
    if (method === "apple_pay") {
        return { method: "apple_pay", provider: "apple_pay" };
    }
    if (method === "mada") {
        return { method: "card", provider: "mada" };
    }
    if (method === "stc_pay") {
        return { method: "card", provider: "stc_pay" };
    }
    return { method: "card", provider: "card" };
};
const resolvePaymentStatus = () => {
    // MVP mode: without real PSP async callbacks, any successful order+payment request is treated as paid.
    return "paid";
};
const createOrderPayment = async (authUser, orderId, payload) => {
    if (authUser.roleCode !== roles_1.ROLE_CODES.CUSTOMER) {
        throw new app_error_1.AppError("Only customers can pay for pickup orders", http_status_codes_1.StatusCodes.FORBIDDEN);
    }
    const order = await orders_repository_1.ordersRepository.findCustomerOrderById(orderId, authUser.userId);
    if (!order) {
        throw new app_error_1.AppError("Order not found", http_status_codes_1.StatusCodes.NOT_FOUND);
    }
    if (order.status === order_status_1.ORDER_STATUS.CANCELLED) {
        throw new app_error_1.AppError("Cancelled orders cannot be paid", http_status_codes_1.StatusCodes.CONFLICT);
    }
    const orderRow = await orders_repository_1.ordersRepository.findOrderById(orderId);
    const paidAmount = Number(orderRow?.total_amount ?? 0);
    const mapped = mapPaymentStorage(payload.method);
    const status = resolvePaymentStatus();
    const providerReference = `sandbox-${payload.method}-${Date.now()}`;
    const existingPayment = await orders_repository_1.ordersRepository.findPaymentByOrderId(orderId);
    if (existingPayment) {
        await orders_repository_1.ordersRepository.updatePaymentForOrder(orderId, {
            method: mapped.method,
            provider: mapped.provider,
            status,
            paidAmount,
            providerReference
        });
    }
    else {
        await orders_repository_1.ordersRepository.createPaymentForOrder({
            orderId,
            method: mapped.method,
            provider: mapped.provider,
            status,
            paidAmount,
            providerReference
        });
    }
    await orders_repository_1.ordersRepository.touchOrderUpdatedAt(orderId);
    await orders_repository_1.ordersRepository.createOrderNotification({
        userId: authUser.userId,
        title: "تم تأكيد الدفع",
        body: `تم تأكيد دفع طلبك رقم ${order.order_number}.`,
        metadata: { orderId, paymentMethod: payload.method, paymentStatus: status }
    });
    return {
        orderId: Number(order.id),
        paymentStatus: status,
        paymentMethod: payload.method,
        provider: mapped.provider,
        providerReference
    };
};
exports.ordersService = {
    createOrder,
    listMyOrders,
    listMyNotifications,
    listIncomingOrders,
    updateOrderStatus,
    createOrderReview,
    createOrderPayment
};
