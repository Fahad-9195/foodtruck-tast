-- Development seed script (run after schema.sql)
-- Password for demo users: Password123!

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE truck_status_history;
TRUNCATE TABLE reviews;
TRUNCATE TABLE favorites;
TRUNCATE TABLE notifications;
TRUNCATE TABLE payments;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE menu_items;
TRUNCATE TABLE categories;
TRUNCATE TABLE municipal_licenses;
TRUNCATE TABLE truck_locations;
TRUNCATE TABLE food_trucks;
TRUNCATE TABLE users;
TRUNCATE TABLE roles;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO roles (id, code, name) VALUES
  (1, 'admin', 'Administrator'),
  (2, 'truck_owner', 'Truck Owner'),
  (3, 'customer', 'Customer');

INSERT INTO users (id, role_id, full_name, email, phone, password_hash, is_active) VALUES
  (1, 1, 'Platform Admin', 'admin@foodtruck.local', '+10000000001', '$2a$10$gXmZtEV4irLBvZSLTtvNUeU00ms8NTvG6pCFIktpOZQTXMbWtrsMG', 1),
  (2, 2, 'Truck Owner', 'owner@foodtruck.local', '+10000000002', '$2a$10$gXmZtEV4irLBvZSLTtvNUeU00ms8NTvG6pCFIktpOZQTXMbWtrsMG', 1),
  (3, 3, 'Customer User', 'customer@foodtruck.local', '+10000000003', '$2a$10$gXmZtEV4irLBvZSLTtvNUeU00ms8NTvG6pCFIktpOZQTXMbWtrsMG', 1);

INSERT INTO food_trucks (
  id, owner_user_id, display_name, slug, description, cover_image_url, avg_rating, rating_count, approval_status, operational_status
) VALUES (
  1, 2, 'Falcon Burger Truck', 'falcon-burger-truck-dev',
  'Premium smash burgers and signature sauces.',
  'https://images.unsplash.com/photo-1550547660-d9450f859349',
  4.70, 31, 'approved', 'open'
);

INSERT INTO truck_locations (
  truck_id, latitude, longitude, neighborhood, city, is_current
) VALUES (
  1, 24.7135520, 46.6752970, 'Al Olaya', 'Riyadh', 1
);

INSERT INTO municipal_licenses (
  truck_id, license_number, document_url, expires_at, review_status, reviewed_by, reviewed_at, review_note
) VALUES (
  1, 'DEV-LIC-001', 'https://example.com/licenses/dev-lic-001.pdf', '2027-12-31',
  'approved', 1, NOW(), 'Approved for development seed'
);

INSERT INTO categories (id, name, slug, icon) VALUES
  (1, 'Burgers', 'burgers', 'burger'),
  (2, 'Drinks', 'drinks', 'cup-soda');

INSERT INTO menu_items (
  truck_id, category_id, name, description, price, image_url, is_available
) VALUES
  (1, 1, 'Smash Double', 'Double beef patty, cheddar, caramelized onions.', 34.00, NULL, 1),
  (1, 1, 'Crispy Chicken Burger', 'Crispy chicken with house slaw and spicy mayo.', 29.00, NULL, 1),
  (1, 2, 'Lemon Mint', 'Fresh lemon and mint cooler.', 14.00, NULL, 1);
