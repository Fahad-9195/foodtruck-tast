"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menusRepository = void 0;
const connection_1 = require("../../../database/connection");
const listByTruck = async (truckId) => {
    return (0, connection_1.db)("menu_items")
        .select("id", "truck_id", "category_id", "name", "description", "price", "image_url", "is_available", "created_at")
        .where({ truck_id: truckId })
        .whereNull("deleted_at")
        .orderBy("created_at", "desc");
};
const listCategories = async () => {
    return (0, connection_1.db)("categories").select("id", "name", "slug", "icon").orderBy("name", "asc");
};
const create = async (payload) => {
    const [id] = await (0, connection_1.db)("menu_items").insert({
        truck_id: payload.truckId,
        category_id: payload.categoryId,
        name: payload.name,
        description: payload.description ?? null,
        price: payload.price,
        image_url: payload.imageUrl ?? null,
        is_available: payload.isAvailable ? 1 : 0
    });
    return Number(id);
};
const findById = async (menuItemId) => {
    return (0, connection_1.db)("menu_items").where({ id: menuItemId }).whereNull("deleted_at").first();
};
const update = async (menuItemId, payload) => {
    const updatePayload = {};
    if (payload.categoryId !== undefined)
        updatePayload.category_id = payload.categoryId;
    if (payload.name !== undefined)
        updatePayload.name = payload.name;
    if (payload.description !== undefined)
        updatePayload.description = payload.description;
    if (payload.price !== undefined)
        updatePayload.price = payload.price;
    if (payload.imageUrl !== undefined)
        updatePayload.image_url = payload.imageUrl;
    if (payload.isAvailable !== undefined)
        updatePayload.is_available = payload.isAvailable ? 1 : 0;
    if (Object.keys(updatePayload).length === 0)
        return;
    await (0, connection_1.db)("menu_items").where({ id: menuItemId }).update(updatePayload);
};
const softDelete = async (menuItemId) => {
    await (0, connection_1.db)("menu_items").where({ id: menuItemId }).update({ deleted_at: connection_1.db.fn.now() });
};
exports.menusRepository = {
    listCategories,
    listByTruck,
    create,
    findById,
    update,
    softDelete
};
