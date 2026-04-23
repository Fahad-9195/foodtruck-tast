import bcrypt from "bcryptjs";
import type { Knex } from "knex";

const ROLE_CODES = {
  ADMIN: "admin",
  TRUCK_OWNER: "truck_owner",
  CUSTOMER: "customer"
} as const;

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  const roles = await knex("roles").select("id", "code");
  const roleMap = new Map(roles.map((role) => [role.code, Number(role.id)]));

  const adminRoleId = roleMap.get(ROLE_CODES.ADMIN);
  const ownerRoleId = roleMap.get(ROLE_CODES.TRUCK_OWNER);
  const customerRoleId = roleMap.get(ROLE_CODES.CUSTOMER);

  if (!adminRoleId || !ownerRoleId || !customerRoleId) {
    throw new Error("Roles must be seeded before user seed execution");
  }

  const passwordHash = await bcrypt.hash("Password123!", 10);

  await knex("users").insert([
    {
      role_id: adminRoleId,
      full_name: "Platform Admin",
      email: "admin@foodtruck.local",
      phone: "+10000000001",
      password_hash: passwordHash
    },
    {
      role_id: ownerRoleId,
      full_name: "Truck Owner",
      email: "owner@foodtruck.local",
      phone: "+10000000002",
      password_hash: passwordHash
    },
    {
      role_id: customerRoleId,
      full_name: "Customer User",
      email: "customer@foodtruck.local",
      phone: "+10000000003",
      password_hash: passwordHash
    }
  ]);
}
