import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("menu_items").del();
  await knex("categories").del();
  await knex("municipal_licenses").del();
  await knex("truck_locations").del();
  await knex("food_trucks").del();

  const owner = await knex("users").where({ email: "owner@foodtruck.local" }).first("id");
  if (!owner) {
    throw new Error("owner@foodtruck.local user must exist before seeding trucks");
  }

  const [truckIdRaw] = await knex("food_trucks").insert({
    owner_user_id: owner.id,
    display_name: "Falcon Burger Truck",
    slug: "falcon-burger-truck-dev",
    description: "Premium smash burgers and signature sauces.",
    cover_image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    approval_status: "approved",
    operational_status: "open",
    avg_rating: 4.7,
    rating_count: 31
  });
  const truckId = Number(truckIdRaw);

  await knex("truck_locations").insert({
    truck_id: truckId,
    latitude: 24.713552,
    longitude: 46.675297,
    neighborhood: "Al Olaya",
    city: "Riyadh",
    is_current: 1
  });

  await knex("municipal_licenses").insert({
    truck_id: truckId,
    license_number: "DEV-LIC-001",
    document_url: "https://example.com/licenses/dev-lic-001.pdf",
    expires_at: "2027-12-31",
    review_status: "approved",
    reviewed_by: owner.id
  });

  const [burgerCategoryIdRaw] = await knex("categories").insert({
    name: "Burgers",
    slug: "burgers",
    icon: "burger"
  });
  const [drinksCategoryIdRaw] = await knex("categories").insert({
    name: "Drinks",
    slug: "drinks",
    icon: "cup-soda"
  });

  await knex("menu_items").insert([
    {
      truck_id: truckId,
      category_id: Number(burgerCategoryIdRaw),
      name: "Smash Double",
      description: "Double beef patty, cheddar, caramelized onions.",
      price: 34.0,
      is_available: 1
    },
    {
      truck_id: truckId,
      category_id: Number(burgerCategoryIdRaw),
      name: "Crispy Chicken Burger",
      description: "Crispy chicken with house slaw and spicy mayo.",
      price: 29.0,
      is_available: 1
    },
    {
      truck_id: truckId,
      category_id: Number(drinksCategoryIdRaw),
      name: "Lemon Mint",
      description: "Fresh lemon and mint cooler.",
      price: 14.0,
      is_available: 1
    }
  ]);
}
