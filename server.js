const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;


app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


const usersFilePath = path.join(__dirname, 'users.json');


const ensureUsersFileExists = () => {
    if (!fs.existsSync(usersFilePath)) {
        
        console.log('users.json not found, creating a new one');
        fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
};


app.post('/signup', (req, res) => {
    const userData = req.body;
    console.log('Received signup data:', userData);  

    
    ensureUsersFileExists();

    
    console.log('Reading from:', usersFilePath);
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        let users = [];
        try {
            users = JSON.parse(data);
            console.log('Existing users:', users);  
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).json({ message: 'Error parsing file data' });
        }

        
        if (users.some(existingUser => existingUser.email === userData.email)) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        
        users.push(userData);

        
        console.log('Saving users to file:', users); 
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error saving data:', err);
                return res.status(500).json({ message: 'Error saving data' });
            }

            console.log('Data successfully saved to users.json');
            res.status(200).json({ message: 'User data saved successfully' });
        });
    });
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Received login data:', { email, password });  

    
    ensureUsersFileExists();

    
    console.log('Reading from:', usersFilePath);
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading file' });
        }

        let users = [];
        try {
            users = JSON.parse(data);
            console.log('Existing users:', users);  
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).json({ message: 'Error parsing file data' });
        }

        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            console.log('Login successful');
            res.status(200).json({ message: 'Login successful' });
        } else {
            console.log('Invalid credentials');
            return res.status(400).json({ message: 'Invalid login credentials' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
