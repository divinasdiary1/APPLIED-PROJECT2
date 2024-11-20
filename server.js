
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const PORT = 3000;

// Serve static files in the current directory
app.use(express.static('./'));
const dataset = 'songDataset.csv'; // The relative path of the dataset

// Endpoint to search the CSV file
app.get('/quiz', (req, res) => {
  const queries = JSON.parse(req.query.queries || '{}'); // Parse query-field pairs
  const results = [];
  const seenRows = new Set(); // Track unique rows

  if (Object.keys(queries).length === 0) {
    return res.status(400).json({ error: 'At least one query-field pair is required' });
  }

  // Read and search the CSV file
  fs.createReadStream(dataset)
    .pipe(csv())
    .on('data', (row) => {
      // Check if any of the specified queries match their respective fields
      const matches = Object.entries(queries).some(
        ([field, query]) => row[field] && row[field].toLowerCase().includes(query.toLowerCase())
      );

      if (matches) {
        const rowString = JSON.stringify(row); // Serialize row for comparison
        if (!seenRows.has(rowString)) {
          seenRows.add(rowString); // Avoid duplicates
          results.push(row);
        }
      }
    })
    .on('end', () => {
      res.json(results); // Send results to the client
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Error reading the CSV file' });
    });
});

// Endpoint to search the CSV file
app.get('/search', (req, res) => {
  const query = req.query.q.toLowerCase();  // Get query from the client-side request
  const results = [];

  // Read and search the CSV file
  fs.createReadStream(dataset)
    .pipe(csv())
    .on('data', (row) => {
      // Check if the row contains the query string
      const rowString = JSON.stringify(row).toLowerCase();
      if (rowString.includes(query)) {
        results.push(row);
      }
    })
    .on('end', () => {
      // Send matching results to the client-side
      res.json(results);
    })
    .on('error', (error) => {
      res.status(500).json({ error: 'Error reading the CSV file' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

