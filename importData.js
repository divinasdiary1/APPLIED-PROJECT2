// Import necessary modules
const admin = require('firebase-admin');  // Firebase Admin SDK
const fs = require('fs');
const csv = require('csv-parser');

// Path to service account key JSON file 
const serviceAccount = require('C:\\Users\\sharm\\OneDrive\\Desktop\\musicfolder\\serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://musicrecommendationsyste-default-rtdb.firebaseio.com"  // Firebase database URL
});

// Firestore database reference
const db = admin.firestore();

// Path to the CSV file 
const csvFilePath = 'C:\\Users\\sharm\\OneDrive\\Desktop\\musicfolder\\songs.csv';

// Function to import CSV data into Firestore
function importCSVData() {
  const songs = [];  // Array to hold songs data from CSV

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath)  // Open the CSV file
    .pipe(csv())  // Parse the CSV file
    .on('data', (row) => {
      console.log('Row read from CSV:', row);  // Logs each row from CSV (you can remove this later)
      songs.push(row);  // Push each row into the songs array
    })
    .on('end', async () => {  // When the CSV file has been completely processed
      console.log('CSV file successfully processed.');

      // Upload each song to Firestore
      for (const song of songs) {
        try {
          await db.collection('songs').add({  // Add song data to Firestore
            title: song.title,  // Assuming the CSV has a "songTitle" column
            artist: song.artist,    // Assuming the CSV has an "artist" column
            genre: song.genre       // Assuming the CSV has a "genre" column
          });
          console.log(`Added song: ${song.title}`);  // Logs the song added to Firestore
        } catch (error) {
          console.error('Error uploading song:', error);  // Logs any error
        }
      }
    });
}

// Call the function to start the import
importCSVData();  // Start importing the CSV data into Firestore
