const express = require('express');
const axios = require('axios');
const haversine = require('haversine');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
const port = 8000;

// Google Maps API setup
const GEOCODE_API_KEY = 'AIzaSyBksByrL1R2XAhGmUay-Ir_JicIsnDk59k';
const GEOCODE_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${GEOCODE_API_KEY}&address=`;

// Sample CSV path
const csvFilePath = '/home/ec2-user/my_project/cwd.csv';

// Middleware to serve static files (for index.html and frontend.js)
app.use(express.static('public')); // Make sure index.html and frontend.js are in 'public' folder

// API to get sorted addresses and distances
app.get('/getSortedAddresses', async (req, res) => {
    const { service, address } = req.query;

    if (!address || !service) {
        return res.status(400).json({ error: 'Missing address or service' });
    }

    try {
        // Get user coordinates
        const userCoords = await geocodeAddress(address);

        // Read and parse CSV data
        const addresses = await readCSV(csvFilePath);
        
        // Calculate distance and sort
        const distances = await calculateDistances(userCoords, addresses, service);
        distances.sort((a, b) => a.distance - b.distance);

        res.json(distances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Helper functions to geocode addresses, read CSV, and calculate distances
async function geocodeAddress(address) {
    const response = await axios.get(`${GEOCODE_API_URL}${encodeURIComponent(address)}`);
    const { lat, lng } = response.data.results[0].geometry.location;
    return { latitude: lat, longitude: lng };
}

function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const addresses = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                addresses.push(row);
            })
            .on('end', () => resolve(addresses))
            .on('error', reject);
    });
}

async function calculateDistances(userCoords, addresses, service) {
    const results = [];
    
    for (const address of addresses) {
        // Assuming your CSV contains service-related data
        if (address.service !== service) continue;

        const fullAddress = `${address.address}, ${address.city}, ${address.zipcode}`;
        const addressCoords = await geocodeAddress(fullAddress);
        const distance = haversine(userCoords, addressCoords);
        
        results.push({
            service: address.service,
            address: address.address,
            city: address.city,
            zipcode: address.zipcode,
            distance
        });
    }
    
    return results;
}

app.listen(8000, '0.0.0.0', () => {
    console.log('Server running at http://0.0.0.0:8000');
});
