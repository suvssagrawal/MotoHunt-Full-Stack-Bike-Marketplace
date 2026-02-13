const express = require('express');
const router = express.Router();
const { getDb, saveDatabase } = require('../database/db');
const { authenticateAdmin } = require('../middleware/auth');

// Helper function to convert SQL result to objects
function rowsToObjects(result, columns) {
    if (!result || result.length === 0 || !result[0].values) return [];

    return result[0].values.map(row => {
        const obj = {};
        columns.forEach((col, idx) => {
            obj[col] = row[idx];
        });
        return obj;
    });
}

// Get all bikes with optional filters
router.get('/', async (req, res) => {
    try {
        const { minPrice, maxPrice, minCC, maxCC, brand, type } = req.query;

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        let baseQuery = `
      SELECT bikes.*, brands.name as brand_name, brands.country_of_origin 
      FROM bikes 
      JOIN brands ON bikes.brand_id = brands.id 
      WHERE 1=1
    `;

        let countQuery = `
      SELECT COUNT(*) as total
      FROM bikes 
      JOIN brands ON bikes.brand_id = brands.id 
      WHERE 1=1
    `;

        const conditions = [];

        if (minPrice) conditions.push(`bikes.price_on_road >= ${parseFloat(minPrice)}`);
        if (maxPrice) conditions.push(`bikes.price_on_road <= ${parseFloat(maxPrice)}`);
        if (minCC) conditions.push(`bikes.engine_cc >= ${parseInt(minCC)}`);
        if (maxCC) conditions.push(`bikes.engine_cc <= ${parseInt(maxCC)}`);
        if (brand) conditions.push(`brands.name = '${brand}'`);
        if (type) conditions.push(`bikes.type = '${type}'`);

        if (conditions.length > 0) {
            const whereClause = ' AND ' + conditions.join(' AND ');
            baseQuery += whereClause;
            countQuery += whereClause;
        }

        baseQuery += ` ORDER BY bikes.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

        const db = await getDb();

        // Get total count first
        const countResult = db.exec(countQuery);
        const total = countResult[0]?.values[0][0] || 0;

        // Get paginated results
        const result = db.exec(baseQuery);

        const bikes = rowsToObjects(result, [
            'id', 'brand_id', 'model_name', 'price_on_road', 'engine_cc',
            'type', 'image_url', 'is_trending', 'created_at', 'mileage', 'top_speed',
            'weight', 'fuel_capacity', 'gears', 'color_options', 'brand_name', 'country_of_origin'
        ]);

        res.json({
            bikes,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get bikes error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get trending bikes
router.get('/trending', async (req, res) => {
    try {
        const db = await getDb();
        const result = db.exec(`
      SELECT bikes.*, brands.name as brand_name, brands.country_of_origin 
      FROM bikes 
      JOIN brands ON bikes.brand_id = brands.id 
      WHERE bikes.is_trending = 1
      ORDER BY bikes.created_at DESC
    `);

        const bikes = rowsToObjects(result, [
            'id', 'brand_id', 'model_name', 'price_on_road', 'engine_cc',
            'type', 'image_url', 'is_trending', 'created_at', 'mileage', 'top_speed',
            'weight', 'fuel_capacity', 'gears', 'color_options', 'brand_name', 'country_of_origin'
        ]);

        res.json({ bikes, count: bikes.length });
    } catch (error) {
        console.error('Get trending bikes error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single bike by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const db = await getDb();
        const result = db.exec(`
      SELECT bikes.*, brands.name as brand_name, brands.country_of_origin, brands.logo_url 
      FROM bikes 
      JOIN brands ON bikes.brand_id = brands.id 
      WHERE bikes.id = ${id}
    `);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ error: 'Bike not found' });
        }

        const bikeRow = result[0].values[0];
        const bike = {
            id: bikeRow[0],
            brand_id: bikeRow[1],
            model_name: bikeRow[2],
            price_on_road: bikeRow[3],
            engine_cc: bikeRow[4],
            type: bikeRow[5],
            image_url: bikeRow[6],
            is_trending: bikeRow[7],
            created_at: bikeRow[8],
            mileage: bikeRow[9],
            top_speed: bikeRow[10],
            weight: bikeRow[11],
            fuel_capacity: bikeRow[12],
            gears: bikeRow[13],
            color_options: bikeRow[14],
            brand_name: bikeRow[15],
            country_of_origin: bikeRow[16],
            logo_url: bikeRow[17]
        };

        res.json({ bike });
    } catch (error) {
        console.error('Get bike error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Compare two bikes
router.get('/compare/data', async (req, res) => {
    try {
        const { id1, id2 } = req.query;

        if (!id1 || !id2) {
            return res.status(400).json({ error: 'Two bike IDs required (id1 and id2)' });
        }

        const db = await getDb();

        const result1 = db.exec(`
      SELECT bikes.*, brands.name as brand_name 
      FROM bikes 
      JOIN brands ON bikes.brand_id = brands.id 
      WHERE bikes.id = ${id1}
    `);

        const result2 = db.exec(`
      SELECT bikes.*, brands.name as brand_name 
      FROM bikes 
      JOIN brands ON bikes.brand_id = brands.id 
      WHERE bikes.id = ${id2}
    `);

        if (result1.length === 0 || result1[0].values.length === 0 ||
            result2.length === 0 || result2[0].values.length === 0) {
            return res.status(404).json({ error: 'One or both bikes not found' });
        }

        const bike1Row = result1[0].values[0];
        const bike1 = {
            id: bike1Row[0],
            brand_id: bike1Row[1],
            model_name: bike1Row[2],
            price_on_road: bike1Row[3],
            engine_cc: bike1Row[4],
            type: bike1Row[5],
            image_url: bike1Row[6],
            is_trending: bike1Row[7],
            created_at: bike1Row[8],
            mileage: bike1Row[9],
            top_speed: bike1Row[10],
            weight: bike1Row[11],
            fuel_capacity: bike1Row[12],
            gears: bike1Row[13],
            color_options: bike1Row[14],
            brand_name: bike1Row[15]
        };

        const bike2Row = result2[0].values[0];
        const bike2 = {
            id: bike2Row[0],
            brand_id: bike2Row[1],
            model_name: bike2Row[2],
            price_on_road: bike2Row[3],
            engine_cc: bike2Row[4],
            type: bike2Row[5],
            image_url: bike2Row[6],
            is_trending: bike2Row[7],
            created_at: bike2Row[8],
            mileage: bike2Row[9],
            top_speed: bike2Row[10],
            weight: bike2Row[11],
            fuel_capacity: bike2Row[12],
            gears: bike2Row[13],
            color_options: bike2Row[14],
            brand_name: bike2Row[15]
        };

        res.json({ bike1, bike2 });
    } catch (error) {
        console.error('Compare bikes error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle trending status (Admin only)
router.patch('/:id/trending', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const db = await getDb();

        // Get current status
        const result = db.exec(`SELECT is_trending FROM bikes WHERE id = ${id}`);

        if (result.length === 0 || result[0].values.length === 0) {
            return res.status(404).json({ error: 'Bike not found' });
        }

        // Toggle status
        const currentStatus = result[0].values[0][0];
        const newStatus = currentStatus === 1 ? 0 : 1;

        db.run(`UPDATE bikes SET is_trending = ${newStatus} WHERE id = ${id}`);
        saveDatabase();

        res.json({
            message: 'Trending status updated successfully',
            is_trending: newStatus === 1
        });
    } catch (error) {
        console.error('Update trending error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
