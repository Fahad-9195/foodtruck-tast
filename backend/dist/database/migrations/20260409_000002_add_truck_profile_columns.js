"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.alterTable("food_trucks", (table) => {
        table.bigInteger("category_id").unsigned().nullable();
        table.string("working_hours", 200).nullable();
        table.string("contact_phone", 30).nullable();
        table.foreign("category_id").references("id").inTable("categories");
    });
}
async function down(knex) {
    await knex.schema.alterTable("food_trucks", (table) => {
        table.dropForeign(["category_id"]);
        table.dropColumn("category_id");
        table.dropColumn("working_hours");
        table.dropColumn("contact_phone");
    });
}
