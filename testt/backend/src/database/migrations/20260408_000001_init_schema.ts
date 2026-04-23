import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("roles", (table) => {
    table.bigIncrements("id").primary();
    table.string("code", 50).notNullable().unique();
    table.string("name", 100).notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex("roles").insert([
    { code: "admin", name: "Admin" },
    { code: "truck_owner", name: "Truck Owner" },
    { code: "customer", name: "Customer" }
  ]);

  await knex.schema.createTable("users", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("role_id").unsigned().notNullable();
    table.string("full_name", 120).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("phone", 30).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.string("avatar_url", 500).nullable();
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamp("deleted_at").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("role_id").references("id").inTable("roles");
  });

  await knex.schema.createTable("food_trucks", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("owner_user_id").unsigned().notNullable();
    table.string("display_name", 140).notNullable();
    table.string("slug", 180).notNullable().unique();
    table.text("description").nullable();
    table.string("cover_image_url", 500).nullable();
    table.decimal("avg_rating", 3, 2).notNullable().defaultTo(0.0);
    table.integer("rating_count").unsigned().notNullable().defaultTo(0);
    table.enu("approval_status", ["pending", "approved", "rejected"]).notNullable().defaultTo("pending");
    table.enu("operational_status", ["open", "busy", "closed", "offline"]).notNullable().defaultTo("offline");
    table.timestamp("deleted_at").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("owner_user_id").references("id").inTable("users");
    table.index(["approval_status", "operational_status"], "idx_food_trucks_status");
    table.index(["owner_user_id"], "idx_food_trucks_owner");
  });

  await knex.schema.createTable("truck_locations", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("truck_id").unsigned().notNullable();
    table.decimal("latitude", 10, 7).notNullable();
    table.decimal("longitude", 10, 7).notNullable();
    table.string("neighborhood", 120).notNullable();
    table.string("city", 120).notNullable();
    table.boolean("is_current").notNullable().defaultTo(true);
    table.timestamp("captured_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("truck_id").references("id").inTable("food_trucks");
    table.index(["city", "neighborhood"], "idx_truck_locations_lookup");
    table.index(["latitude", "longitude"], "idx_truck_locations_coords");
    table.index(["truck_id", "is_current"], "idx_truck_locations_current");
  });

  await knex.schema.createTable("municipal_licenses", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("truck_id").unsigned().notNullable();
    table.string("license_number", 80).notNullable().unique();
    table.string("document_url", 500).notNullable();
    table.date("expires_at").notNullable();
    table.enu("review_status", ["pending", "approved", "rejected"]).notNullable().defaultTo("pending");
    table.bigInteger("reviewed_by").unsigned().nullable();
    table.timestamp("reviewed_at").nullable();
    table.string("review_note", 500).nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("truck_id").references("id").inTable("food_trucks");
    table.foreign("reviewed_by").references("id").inTable("users");
    table.index(["review_status"], "idx_licenses_status");
    table.index(["truck_id"], "idx_licenses_truck");
  });

  await knex.schema.createTable("categories", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 100).notNullable();
    table.string("slug", 120).notNullable().unique();
    table.string("icon", 120).nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("menu_items", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("truck_id").unsigned().notNullable();
    table.bigInteger("category_id").unsigned().notNullable();
    table.string("name", 140).notNullable();
    table.text("description").nullable();
    table.decimal("price", 10, 2).notNullable();
    table.string("image_url", 500).nullable();
    table.boolean("is_available").notNullable().defaultTo(true);
    table.timestamp("deleted_at").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("truck_id").references("id").inTable("food_trucks");
    table.foreign("category_id").references("id").inTable("categories");
    table.index(["truck_id"], "idx_menu_items_truck");
    table.index(["category_id"], "idx_menu_items_category");
    table.index(["truck_id", "is_available"], "idx_menu_items_available");
  });

  await knex.schema.createTable("orders", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("customer_user_id").unsigned().notNullable();
    table.bigInteger("truck_id").unsigned().notNullable();
    table.string("order_number", 40).notNullable().unique();
    table.enu("status", ["pending", "preparing", "ready", "picked_up", "cancelled"]).notNullable().defaultTo("pending");
    table.decimal("subtotal_amount", 10, 2).notNullable();
    table.decimal("tax_amount", 10, 2).notNullable().defaultTo(0);
    table.decimal("service_fee_amount", 10, 2).notNullable().defaultTo(0);
    table.decimal("total_amount", 10, 2).notNullable();
    table.integer("estimated_ready_minutes").unsigned().nullable();
    table.timestamp("placed_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("ready_at").nullable();
    table.timestamp("picked_up_at").nullable();
    table.timestamp("cancelled_at").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("customer_user_id").references("id").inTable("users");
    table.foreign("truck_id").references("id").inTable("food_trucks");
    table.index(["customer_user_id"], "idx_orders_customer");
    table.index(["truck_id", "status"], "idx_orders_truck_status");
    table.index(["placed_at"], "idx_orders_placed_at");
  });

  await knex.schema.createTable("order_items", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("order_id").unsigned().notNullable();
    table.bigInteger("menu_item_id").unsigned().notNullable();
    table.integer("quantity").unsigned().notNullable();
    table.decimal("unit_price", 10, 2).notNullable();
    table.decimal("line_total", 10, 2).notNullable();
    table.string("notes", 300).nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("order_id").references("id").inTable("orders");
    table.foreign("menu_item_id").references("id").inTable("menu_items");
    table.index(["order_id"], "idx_order_items_order");
  });

  await knex.schema.createTable("payments", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("order_id").unsigned().notNullable().unique();
    table.enu("method", ["card", "apple_pay", "cash"]).notNullable();
    table.string("provider", 80).nullable();
    table.string("provider_reference", 120).nullable();
    table.enu("status", ["pending", "authorized", "paid", "failed", "refunded"]).notNullable().defaultTo("pending");
    table.decimal("paid_amount", 10, 2).notNullable();
    table.timestamp("paid_at").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("order_id").references("id").inTable("orders");
    table.index(["status"], "idx_payments_status");
  });

  await knex.schema.createTable("notifications", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("user_id").unsigned().notNullable();
    table.enu("type", ["order_update", "system", "admin_action"]).notNullable();
    table.string("title", 140).notNullable();
    table.string("body", 500).notNullable();
    table.boolean("is_read").notNullable().defaultTo(false);
    table.json("metadata_json").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("user_id").references("id").inTable("users");
    table.index(["user_id", "is_read", "created_at"], "idx_notifications_user");
  });

  await knex.schema.createTable("favorites", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("user_id").unsigned().notNullable();
    table.bigInteger("truck_id").unsigned().notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("user_id").references("id").inTable("users");
    table.foreign("truck_id").references("id").inTable("food_trucks");
    table.unique(["user_id", "truck_id"], { indexName: "uq_favorites_user_truck" });
  });

  await knex.schema.createTable("reviews", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("user_id").unsigned().notNullable();
    table.bigInteger("truck_id").unsigned().notNullable();
    table.bigInteger("order_id").unsigned().nullable();
    table.integer("rating").unsigned().notNullable();
    table.string("comment", 700).nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.foreign("user_id").references("id").inTable("users");
    table.foreign("truck_id").references("id").inTable("food_trucks");
    table.foreign("order_id").references("id").inTable("orders");
    table.index(["truck_id"], "idx_reviews_truck");
  });

  await knex.schema.createTable("truck_status_history", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("truck_id").unsigned().notNullable();
    table.enu("status", ["open", "busy", "closed", "offline"]).notNullable();
    table.bigInteger("changed_by_user_id").unsigned().notNullable();
    table.timestamp("changed_at").notNullable().defaultTo(knex.fn.now());
    table.string("note", 300).nullable();

    table.foreign("truck_id").references("id").inTable("food_trucks");
    table.foreign("changed_by_user_id").references("id").inTable("users");
    table.index(["truck_id", "changed_at"], "idx_truck_status_history_truck_time");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("truck_status_history");
  await knex.schema.dropTableIfExists("reviews");
  await knex.schema.dropTableIfExists("favorites");
  await knex.schema.dropTableIfExists("notifications");
  await knex.schema.dropTableIfExists("payments");
  await knex.schema.dropTableIfExists("order_items");
  await knex.schema.dropTableIfExists("orders");
  await knex.schema.dropTableIfExists("menu_items");
  await knex.schema.dropTableIfExists("categories");
  await knex.schema.dropTableIfExists("municipal_licenses");
  await knex.schema.dropTableIfExists("truck_locations");
  await knex.schema.dropTableIfExists("food_trucks");
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("roles");
}
