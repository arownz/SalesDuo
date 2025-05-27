-- Sales Data Database Tables
-- Database: sales_data

-- Create menu_tb table
CREATE TABLE IF NOT EXISTS menu_tb (
    menu_id INT PRIMARY KEY AUTO_INCREMENT,
    menu_name VARCHAR(255) NOT NULL,
    menu_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create sales_tb table
CREATE TABLE IF NOT EXISTS sales_tb (
    sales_id INT PRIMARY KEY AUTO_INCREMENT,
    menu_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES menu_tb(menu_id) ON DELETE CASCADE
);

-- Insert sample data into menu_tb
INSERT INTO menu_tb (menu_name, menu_price) VALUES
('Chicken Burger', 12.99),
('Beef Burger', 15.99),
('Veggie Burger', 10.99),
('French Fries', 5.99),
('Caesar Salad', 8.99),
('Pizza Margherita', 14.99),
('Spaghetti Carbonara', 13.99),
('Fish and Chips', 16.99),
('Grilled Chicken', 18.99),
('Chocolate Cake', 6.99);

-- Insert sample data into sales_tb
INSERT INTO sales_tb (menu_id, quantity) VALUES
(1, 2),
(2, 1),
(3, 3),
(4, 5),
(5, 1),
(6, 2),
(7, 1),
(8, 1),
(9, 2),
(10, 4),
(1, 1),
(3, 2),
(5, 3),
(7, 1),
(9, 1);
