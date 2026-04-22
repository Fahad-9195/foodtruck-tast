CREATE TABLE roles (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles (code, name) VALUES
('admin', 'Admin'),
('truck_owner', 'Truck Owner'),
('customer', 'Customer');

CREATE TABLE users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  role_id BIGINT UNSIGNED NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(30) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE food_trucks (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NULL,
  display_name VARCHAR(140) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  description TEXT NULL,
  cover_image_url VARCHAR(500) NULL,
  working_hours VARCHAR(200) NULL,
  contact_phone VARCHAR(30) NULL,
  avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  rating_count INT UNSIGNED NOT NULL DEFAULT 0,
  approval_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  operational_status ENUM('open','busy','closed','offline') NOT NULL DEFAULT 'offline',
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_food_trucks_owner FOREIGN KEY (owner_user_id) REFERENCES users(id),
  INDEX idx_food_trucks_status (approval_status, operational_status),
  INDEX idx_food_trucks_owner (owner_user_id)
);

CREATE TABLE truck_locations (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  truck_id BIGINT UNSIGNED NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  neighborhood VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  is_current TINYINT(1) NOT NULL DEFAULT 1,
  captured_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_truck_locations_truck FOREIGN KEY (truck_id) REFERENCES food_trucks(id),
  INDEX idx_truck_locations_lookup (city, neighborhood),
  INDEX idx_truck_locations_coords (latitude, longitude),
  INDEX idx_truck_locations_current (truck_id, is_current)
);

CREATE TABLE municipal_licenses (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  truck_id BIGINT UNSIGNED NOT NULL,
  license_number VARCHAR(80) NOT NULL UNIQUE,
  document_url VARCHAR(500) NOT NULL,
  expires_at DATE NOT NULL,
  review_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at TIMESTAMP NULL,
  review_note VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_licenses_truck FOREIGN KEY (truck_id) REFERENCES food_trucks(id),
  CONSTRAINT fk_licenses_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id),
  INDEX idx_licenses_status (review_status),
  INDEX idx_licenses_truck (truck_id)
);

CREATE TABLE categories (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  icon VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  truck_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(140) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500) NULL,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_menu_items_truck FOREIGN KEY (truck_id) REFERENCES food_trucks(id),
  CONSTRAINT fk_menu_items_category FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_menu_items_truck (truck_id),
  INDEX idx_menu_items_category (category_id),
  INDEX idx_menu_items_available (truck_id, is_available)
);

CREATE TABLE orders (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  customer_user_id BIGINT UNSIGNED NOT NULL,
  truck_id BIGINT UNSIGNED NOT NULL,
  order_number VARCHAR(40) NOT NULL UNIQUE,
  status ENUM('pending','preparing','ready','picked_up','cancelled') NOT NULL DEFAULT 'pending',
  subtotal_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  service_fee_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  estimated_ready_minutes INT UNSIGNED NULL,
  placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ready_at TIMESTAMP NULL,
  picked_up_at TIMESTAMP NULL,
  cancelled_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_user_id) REFERENCES users(id),
  CONSTRAINT fk_orders_truck FOREIGN KEY (truck_id) REFERENCES food_trucks(id),
  INDEX idx_orders_customer (customer_user_id),
  INDEX idx_orders_truck_status (truck_id, status),
  INDEX idx_orders_placed_at (placed_at)
);

CREATE TABLE order_items (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  menu_item_id BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  notes VARCHAR(300) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_items_menu_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id),
  INDEX idx_order_items_order (order_id)
);

CREATE TABLE payments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL UNIQUE,
  method ENUM('card','apple_pay','cash') NOT NULL,
  provider VARCHAR(80) NULL,
  provider_reference VARCHAR(120) NULL,
  status ENUM('pending','authorized','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  paid_amount DECIMAL(10,2) NOT NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_payments_status (status)
);

CREATE TABLE notifications (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  type ENUM('order_update','system','admin_action') NOT NULL,
  title VARCHAR(140) NOT NULL,
  body VARCHAR(500) NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  metadata_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_notifications_user (user_id, is_read, created_at)
);

CREATE TABLE favorites (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  truck_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_favorites_truck FOREIGN KEY (truck_id) REFERENCES food_trucks(id),
  UNIQUE KEY uq_favorites_user_truck (user_id, truck_id)
);

CREATE TABLE reviews (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  truck_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment VARCHAR(700) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_reviews_truck FOREIGN KEY (truck_id) REFERENCES food_trucks(id),
  CONSTRAINT fk_reviews_order FOREIGN KEY (order_id) REFERENCES orders(id),
  INDEX idx_reviews_truck (truck_id)
);

CREATE TABLE truck_status_history (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  truck_id BIGINT UNSIGNED NOT NULL,
  status ENUM('open','busy','closed','offline') NOT NULL,
  changed_by_user_id BIGINT UNSIGNED NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note VARCHAR(300) NULL,
  CONSTRAINT fk_truck_status_history_truck FOREIGN KEY (truck_id) REFERENCES food_trucks(id),
  CONSTRAINT fk_truck_status_history_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id),
  INDEX idx_truck_status_history_truck_time (truck_id, changed_at)
);
