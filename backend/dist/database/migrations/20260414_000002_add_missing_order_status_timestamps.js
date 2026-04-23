"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const ORDERS_TABLE = "orders";
const COLUMNS = ["ready_at", "picked_up_at", "cancelled_at"];
async function up(knex) {
    const existing = await Promise.all(COLUMNS.map((column) => knex.schema.hasColumn(ORDERS_TABLE, column)));
    const missingColumns = COLUMNS.filter((_, index) => !existing[index]);
    if (missingColumns.length === 0)
        return;
    await knex.schema.alterTable(ORDERS_TABLE, (table) => {
        if (missingColumns.includes("ready_at"))
            table.timestamp("ready_at").nullable();
        if (missingColumns.includes("picked_up_at"))
            table.timestamp("picked_up_at").nullable();
        if (missingColumns.includes("cancelled_at"))
            table.timestamp("cancelled_at").nullable();
    });
}
async function down(knex) {
    const existing = await Promise.all(COLUMNS.map((column) => knex.schema.hasColumn(ORDERS_TABLE, column)));
    const removableColumns = COLUMNS.filter((_, index) => existing[index]);
    if (removableColumns.length === 0)
        return;
    await knex.schema.alterTable(ORDERS_TABLE, (table) => {
        if (removableColumns.includes("ready_at"))
            table.dropColumn("ready_at");
        if (removableColumns.includes("picked_up_at"))
            table.dropColumn("picked_up_at");
        if (removableColumns.includes("cancelled_at"))
            table.dropColumn("cancelled_at");
    });
}
