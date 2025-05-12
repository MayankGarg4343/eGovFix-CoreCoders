const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./models/User'); // Adjust the path if your models directory is elsewhere

// MongoDB connection URL (replace if necessary)
const dbURI = 'mongodb://localhost:27017/egovfix'; // Make sure this matches your server.js

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected for migration');

    // Read user data from users.json
    const usersFilePath = path.join(__dirname, 'users.json'); // Adjust the path if users.json is elsewhere

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading users.json:', err);
        mongoose.connection.close();
        return;
      }

      try {
        const users = JSON.parse(data);

        // Insert users into MongoDB
        User.insertMany(users)
          .then(() => {
            console.log('User data migrated successfully');
            mongoose.connection.close();
          })
          .catch(err => {
            console.error('Error inserting users into MongoDB:', err);
            mongoose.connection.close();
          });

      } catch (parseErr) {
        console.error('Error parsing users.json:', parseErr);
        mongoose.connection.close();
      }
    });
  })
  .catch(err => console.error('MongoDB connection error for migration:', err));
