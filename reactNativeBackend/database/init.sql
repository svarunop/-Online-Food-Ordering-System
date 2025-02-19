-- Drop existing tables to avoid conflicts
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Super_Admin_Actions, Notifications, Payment, Order_Items, Orders, Cart, Menu_Items, Resto_Signup, Restaurants, Users, Super_Admin;
SET FOREIGN_KEY_CHECKS = 1;

-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    extra_col1 VARCHAR(255) DEFAULT NULL,
    extra_col2 VARCHAR(255) DEFAULT NULL,
    extra_col3 INT DEFAULT NULL,
    extra_col4 DATETIME DEFAULT NULL
);

-- Insert Dummy Data
INSERT INTO Users (username, password, email, phone_number) VALUES
('JohnDoe', 'hashed_password_1', 'johndoe@example.com', '9876543210'),
('JaneSmith', 'hashed_password_2', 'janesmith@example.com', '9123456789'),
('AliceBrown', 'hashed_password_3', 'alicebrown@example.com', '9988776655');

-- Restaurants Table
CREATE TABLE Restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    contact_number VARCHAR(15),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    status ENUM('open', 'closed') DEFAULT 'open'
);

INSERT INTO Restaurants (name, description, address, contact_number, rating) VALUES
('Indian Accent', 'Fine dining with modern Indian cuisine', 'New Delhi, India', '9876543211', 4.8),
('Pizza Planet', 'Best pizza in town!', 'Mumbai, India', '9123456788', 4.5);

-- Resto Signup Table
CREATE TABLE Resto_Signup (
    resto_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- Menu Items Table
CREATE TABLE Menu_Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50),
    availability BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

INSERT INTO Menu_Items (restaurant_id, name, description, price, category) VALUES
(1, 'Butter Chicken', 'Creamy tomato-based curry with grilled chicken', 399.00, 'Main Course'),
(1, 'Paneer Tikka', 'Spiced and grilled cottage cheese', 249.00, 'Starter'),
(2, 'Pepperoni Pizza', 'Cheesy pizza with spicy pepperoni', 499.00, 'Main Course'),
(2, 'Garlic Bread', 'Toasted bread with garlic butter', 149.00, 'Starter');

-- Cart Table
CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    total_price DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'preparing', 'ready', 'completed', 'canceled') DEFAULT 'pending',
    delivery_status ENUM('pending', 'dispatched', 'delivered') DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- Order Items Table
CREATE TABLE Order_Items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Menu_Items(item_id) ON DELETE CASCADE
);

-- Payment Table
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'cash', 'UPI') NOT NULL,
    payment_status ENUM('paid', 'pending', 'failed') DEFAULT 'pending',
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

-- Super Admin Table
CREATE TABLE Super_Admin (
    super_admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO Super_Admin (username, email, password) VALUES
('admin', 'admin@example.com', 'hashed_admin_password');

-- Super Admin Actions Table
CREATE TABLE Super_Admin_Actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    super_admin_id INT NOT NULL,
    action_type ENUM('add_restaurant', 'delete_restaurant', 'edit_restaurant', 'push_notification', 'offer_management') NOT NULL,
    target_id INT NOT NULL,
    details TEXT,
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (super_admin_id) REFERENCES Super_Admin(super_admin_id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    super_admin_id INT NOT NULL,
    offer_name VARCHAR(255) NOT NULL,
    discount TINYINT(3) UNSIGNED NOT NULL CHECK (discount BETWEEN 1 AND 100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    status TINYINT(1) DEFAULT 1,
    promocode VARCHAR(100),
    FOREIGN KEY (super_admin_id) REFERENCES Super_Admin(super_admin_id) ON DELETE CASCADE
);

-- Indexes for Performance
CREATE INDEX idx_email ON Users(email);
CREATE INDEX idx_restaurant_id ON Restaurants(restaurant_id);
CREATE INDEX idx_order_id ON Orders(order_id);
