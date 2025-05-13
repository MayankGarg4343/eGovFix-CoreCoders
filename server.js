const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;
const usersFile = path.join(__dirname, "users.json");
const joinUsFile = path.join(__dirname, "joinus.json");
const uploadsDir = path.join(__dirname, "uploads");
const saltRounds = 10;
const dbURI = 'mongodb://localhost:27017/egovfix'; // You can change 'egovfix' to your desired database name

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const User = require('./models/User'); // Adjust the path if necessary


// Enable CORS with credentials
app.use(cors({
    origin: '*', // Allow all origins during development
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// ensure the file exists.
if (!fs.existsSync(joinUsFile)) {
  fs.writeFileSync(joinUsFile, JSON.stringify([], null, 2));
}

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load users data
const loadUsers = () => {
  if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
      return [];
  }
  const data = fs.readFileSync(usersFile, "utf8");
  return JSON.parse(data);
};

// Save users data
const saveUsers = (users) => {
  fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
    if (err) {
        console.error("Error writing file:", err);
    } else {
        console.log("User data saved successfully!");
    }
});
};

const loadJoinUsData = () => {
  if (!fs.existsSync(joinUsFile)) {
      fs.writeFileSync(joinUsFile, JSON.stringify([], null, 2));
      return [];
  }
  const data = fs.readFileSync(joinUsFile, "utf8");
  return JSON.parse(data);
};

// Save join us form data
const saveJoinUsData = (data) => {
  fs.writeFileSync(joinUsFile, JSON.stringify(data, null, 2));
};

// **Signup Route**
app.post("/signup", async (req, res) => {
  try {
      const { username, password, date, aadhar, phone, userType } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user instance
      const newUser = new User({
          username,
          password: hashedPassword,
          date,
          aadhar,
          phone,
          userType: userType || 'user'
      });

      // Save the user to the database
      await newUser.save();

      console.log("User registered successfully:", newUser);
      res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
      console.error("Error in signup route:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


// Sign-in Route
app.post("/signin", async (req, res) => {
  try {
      const { username, password } = req.body;

      // Find the user in the database
      const user = await User.findOne({ username });

      // If user not found
      if (!user) {
          return res.status(401).json({ success: false, message: "Invalid username or password" });
      }

      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // If password is not valid
      if (!isPasswordValid) {
          return res.status(401).json({ success: false, message: "Invalid username or password" });
      }

      // If authentication is successful
      console.log("User signed in successfully:", user);

      // **Line to add/check:** Set session information
      req.session.user = {
          username: user.username,
          userType: user.userType,
          // You can add other relevant user data here
      };

      // Determine redirect URL based on user type
      const redirectUrl = user.userType === 'admin' ? '/adminDashboard.html' : (user.userType === 'guest' ? '/guestDashboard.html' : '/dashboard.html'); // Adjust paths as needed

      // Send successful response with redirect URL
      res.status(200).json({ success: true, message: "Sign-in successful", user: { username: user.username, userType: user.userType }, redirect: redirectUrl });

  } catch (error) {
      console.error("Error in signin route:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
});




// **Check Authentication Status**
app.get("/check-auth", (req, res) => {
  if (req.session.user) {
      // User is authenticated
      res.json({
          authenticated: true,
          username: req.session.user.username,
          userType: req.session.user.userType
      });
  } else {
      // User is not authenticated
      res.json({ authenticated: false });
  }
});

// **Logout Route**
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logout successful" });
  });
});

// **Middleware to Check User Type**
const checkUserType = (allowedTypes) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in first." });
        }
        if (!allowedTypes.includes(req.session.user.userType)) {
            return res.status(403).json({ message: "Access denied. Invalid user type." });
        }
        next();
    };
};

// ✅ **Document Upload (Separate storage for each user)**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!req.session.user) {
      return cb(new Error("Unauthorized"));
    }

    const userDir = path.join(uploadsDir, req.session.user.username);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload", checkUserType(['admin', 'user']), upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(201).json({ message: "Document uploaded successfully", filename: req.file.filename });
});

// ✅ **Get Uploaded Documents**
app.get("/documents", checkUserType(['admin', 'user']), (req, res) => {
  const username = req.session.user.username;
  const userDir = path.join(uploadsDir, username);

  if (!fs.existsSync(userDir)) {
    return res.json({ documents: [] });
  }

  const files = fs.readdirSync(userDir).map((filename) => ({
    filename,
    path: `/uploads/${username}/${filename}`,
  }));

  res.json({ documents: files });
});

// ✅ **Download Document**
app.get("/download/:filename", checkUserType(['admin', 'user']), (req, res) => {
  const username = req.session.user.username;
  const filePath = path.join(uploadsDir, username, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath);
});

// ✅ **Delete Document**
app.delete("/delete/:filename", checkUserType(['admin', 'user']), (req, res) => {
  const username = req.session.user.username;
  const filePath = path.join(uploadsDir, username, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  fs.unlinkSync(filePath);
  res.json({ message: "File deleted successfully" });
});

app.post("/become_partner", (req, res) => {
  const { name, email, phone, company, message } = req.body;
  
  if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All required fields must be filled" });
  }

  const joinUsData = loadJoinUsData();

  joinUsData.push({ name, email, phone, company, message, submittedAt: new Date().toISOString() });

  saveJoinUsData(joinUsData);
  res.status(201).json({ message: "Application submitted successfully" });
});

// ✅ **Start Server**
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
