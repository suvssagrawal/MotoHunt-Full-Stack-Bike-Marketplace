-- MotoHunt Database Schema (SQLite)
-- Converted from PostgreSQL to SQLite syntax

-- 1. BRANDS: Stores manufacturer details
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE, 
    logo_url VARCHAR(255),             
    country_of_origin VARCHAR(100)
);

-- 2. BIKES: The core inventory table
CREATE TABLE IF NOT EXISTS bikes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER NOT NULL,
    model_name VARCHAR(150) NOT NULL,  
    price_on_road REAL,                -- REAL for decimal values (e.g. 250000.00)
    engine_cc INTEGER,                 -- Integer for filtering (e.g. 350)
    type VARCHAR(50),                  -- e.g. 'Cruiser', 'Sports'
    image_url VARCHAR(500),            
    is_trending INTEGER DEFAULT 0,     -- SQLite uses 0/1 for boolean
    -- New detailed specifications
    mileage REAL,                      -- Fuel efficiency in km/l
    top_speed INTEGER,                 -- Maximum speed in km/h
    weight REAL,                       -- Kerb weight in kg
    fuel_capacity REAL,                -- Tank capacity in liters
    gears INTEGER,                     -- Number of gears (5 or 6)
    color_options TEXT,                -- Comma-separated color names
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE
);

-- 3. DEALERS: Mock showroom data for bookings
CREATE TABLE IF NOT EXISTS dealers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200),                 
    city VARCHAR(100),                 
    location_area VARCHAR(150),        
    contact_number VARCHAR(15)
);

-- 4. USERS: For authentication
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer', -- 'admin' or 'customer'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. TEST_RIDES: Stores user bookings
CREATE TABLE IF NOT EXISTS test_rides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bike_id INTEGER NOT NULL,
    dealer_id INTEGER NOT NULL,
    booking_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending', -- 'Confirmed', 'Cancelled'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE,
    FOREIGN KEY (dealer_id) REFERENCES dealers(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bikes_brand ON bikes(brand_id);
CREATE INDEX IF NOT EXISTS idx_bikes_trending ON bikes(is_trending);
CREATE INDEX IF NOT EXISTS idx_bikes_price ON bikes(price_on_road);
CREATE INDEX IF NOT EXISTS idx_bikes_cc ON bikes(engine_cc);
CREATE INDEX IF NOT EXISTS idx_test_rides_user ON test_rides(user_id);
