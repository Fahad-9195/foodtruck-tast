"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
const ROLE_CODES = {
    ADMIN: "admin",
    TRUCK_OWNER: "truck_owner",
    CUSTOMER: "customer"
};
async function seed(knex) {
    await knex("roles").del();
    await knex("roles").insert([
        { code: ROLE_CODES.ADMIN, name: "Administrator" },
        { code: ROLE_CODES.TRUCK_OWNER, name: "Truck Owner" },
        { code: ROLE_CODES.CUSTOMER, name: "Customer" }
    ]);
}
