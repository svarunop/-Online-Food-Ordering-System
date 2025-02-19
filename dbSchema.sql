-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, -- Added UNIQUE constraint for performance
    phone_number VARCHAR(15),
    extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
    extra_col3 INT DEFAULT NULL,          -- 
    extra_col4 DATETIME DEFAULT NULL      -- 
);

-- Restaurants Table
CREATE TABLE Restaurants (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address VARCHAR(255),
    contact_number VARCHAR(15),
    rating DECIMAL(3, 2) DEFAULT 0.00,
    status ENUM('open', 'closed') DEFAULT 'open',
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL
);

-- Resto Signup Table (For Restaurant Owners)
CREATE TABLE Resto_Signup (
    resto_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending', -- Approval system for Super Admin
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
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
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

-- Cart Table
CREATE TABLE Cart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    total_price DECIMAL(10, 2) DEFAULT 0.00,
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
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
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
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
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
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
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE
);

-- Super Admin Table
CREATE TABLE Super_Admin (
    super_admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
);

-- Super Admin Actions Table
CREATE TABLE Super_Admin_Actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    super_admin_id INT NOT NULL,
    action_type ENUM('add_restaurant', 'delete_restaurant', 'edit_restaurant', 'push_notification') NOT NULL,
    target_id INT NOT NULL, -- Can be restaurant_id or user_id, depending on action
    details TEXT,
    action_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
    FOREIGN KEY (super_admin_id) REFERENCES Super_Admin(super_admin_id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    super_admin_id INT NOT NULL,
    offer_name VARCHAR(255) NOT NULL,
    discount TINYINT(3) UNSIGNED NOT NULL CHECK (discount BETWEEN 1 AND 100), -- Percentage (1-100)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL, -- Expiry timestamp
    status TINYINT(1) DEFAULT 1, -- 1 = Active, 0 = Expired,
    promocode varchar(100),
      extra_col1 VARCHAR(255) DEFAULT NULL, -- Reserved for future use
    extra_col2 VARCHAR(255) DEFAULT NULL, -- 
    FOREIGN KEY (super_admin_id) REFERENCES Super_Admin(super_admin_id) ON DELETE CASCADE
);



-- Indexes for Performance
CREATE INDEX idx_email ON Users(email);
CREATE INDEX idx_restaurant_id ON Restaurants(restaurant_id);
CREATE INDEX idx_order_id ON Orders(order_id);
