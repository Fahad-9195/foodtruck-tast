import type { Knex } from "knex";

const ROLE_CODES = {
  ADMIN: "admin",
  TRUCK_OWNER: "truck_owner",
  CUSTOMER: "customer"
} as const;

export async function seed(knex: Knex): Promise<void> {
  await knex("roles").del();

  await knex("roles").insert([
    { code: ROLE_CODES.ADMIN, name: "Administrator" },
    { code: ROLE_CODES.TRUCK_OWNER, name: "Truck Owner" },
    { code: ROLE_CODES.CUSTOMER, name: "Customer" }
  ]);
}
