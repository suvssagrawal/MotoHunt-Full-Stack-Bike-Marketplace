-- Insert Brands
INSERT INTO brands (name, logo_url, country_of_origin) VALUES
('Honda', 'https://upload.wikimedia.org/wikipedia/commons/7/79/Honda_logo.svg', 'Japan'),
('Royal Enfield', 'https://upload.wikimedia.org/wikipedia/en/4/49/Royal_Enfield_logo.svg', 'India'),
('Triumph', 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Triumph_Motorcycles_logo.svg', 'UK'),
('Yamaha', 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Yamaha_Motor_text_logo.svg', 'Japan'),
('KTM', 'https://upload.wikimedia.org/wikipedia/commons/3/3f/KTM-Logo.svg', 'Austria'),
('Bajaj', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Bajaj_Auto_Logo.svg', 'India');

-- Insert Bikes with real images and detailed specifications
INSERT INTO bikes (brand_id, model_name, price_on_road, engine_cc, type, image_url, is_trending, mileage, top_speed, weight, fuel_capacity, gears, color_options) VALUES
(1, 'CB350RS', 250000, 348, 'Retro', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/107543/cb350rs-right-front-three-quarter.jpeg?isig=0', 1, 38.0, 125, 181.0, 15.0, 5, 'Red,Black,Gray'),
(2, 'Classic 350', 230000, 349, 'Cruiser', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/130591/classic-350-right-front-three-quarter-109.jpeg?isig=0', 1, 35.0, 120, 195.0, 13.0, 5, 'Black,Green,Blue,Maroon'),
(2, 'Meteor 350', 245000, 349, 'Cruiser', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/48542/meteor-350-right-front-three-quarter-3.jpeg?isig=0', 0, 36.0, 118, 191.0, 15.0, 5, 'Yellow,Red,Black'),
(3, 'Speed 400', 290000, 398, 'Roadster', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/130583/speed-400-right-front-three-quarter-3.jpeg?isig=0', 1, 30.0, 145, 170.0, 13.0, 6, 'Red,Blue,Black'),
(3, 'Scrambler 400X', 320000, 398, 'Scrambler', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/130585/scrambler-400-x-right-front-three-quarter-2.jpeg?isig=0', 0, 28.0, 140, 180.0, 13.0, 6, 'Orange,Green,Gray'),
(4, 'R15 V4', 220000, 155, 'Sports', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/134287/yzf-r15-right-front-three-quarter-7.jpeg?isig=0', 1, 45.0, 136, 142.0, 11.0, 6, 'Blue,Black,Red'),
(5, 'Duke 390', 340000, 373, 'Naked', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/130681/390-duke-right-front-three-quarter-3.jpeg?isig=0', 1, 25.0, 167, 167.0, 13.5, 6, 'Orange,White,Black'),
(6, 'Dominar 400', 280000, 373, 'Tourer', 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/141867/dominar-400-right-front-three-quarter-71.jpeg?isig=0', 0, 27.0, 156, 193.0, 13.0, 6, 'Black,Blue,Green');

-- Insert Dealers
INSERT INTO dealers (name, city, location_area, contact_number) VALUES
('Sai Motors', 'Pune', 'Viman Nagar', '+91-9876543210'),
('Metro SuperBikes', 'Mumbai', 'Andheri West', '+91-9876543211'),
('Capital Auto', 'Delhi', 'Connaught Place', '+91-9876543212');

-- Insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@motohunt.com', '$2a$10$rZ8qN.8QJ0XV4HZ4FZ8Q4eH8RJxZ5J8qN.8QJ0XV4HZ4FZ8Q4eH8RJ', 'admin'),
('testuser', 'test@example.com', '$2a$10$rZ8qN.8QJ0XV4HZ4FZ8Q4eH8RJxZ5J8qN.8QJ0XV4HZ4FZ8Q4eH8RJ', 'customer');
