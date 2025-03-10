const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const multer = require("multer");

const app = express();
const PORT = 3000;
const usersFile = path.join(__dirname, "users.json");
const joinUsFile = path.join(__dirname, "joinus.json");
const uploadsDir = path.join(__dirname, "uploads");
const saltRounds = 10;

// Enable CORS with credentials

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
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
      fs.writeFileSync(usersFile, JSON.stringify([], null, 2)); // Create an empty file if not exists
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

// ✅ **Signup Route**
app.post("/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const { username, password, date, aadhar, phone } = req.body;
  
  let users = loadUsers();
  console.log("Current users:", users);

  if (users.find(user => user.username === username)) {
      console.log("User already exists!");
      return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  users.push({ username, password: hashedPassword, date, aadhar, phone });

  console.log("Updated users:", users);

  fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
      if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).json({ message: "Error saving user data" });
      }
      console.log("User data saved successfully!");
      res.status(201).json({ message: "User registered successfully" });
  });
});


// ✅ **Signin Route**
app.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  let users = loadUsers();
  
  const user = users.find(user => user.username === username);
  if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
  }
  
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
  }
  
  req.session.user = user;
  res.status(200).json({ message: "Login successful", redirect: "/landing.html" });
});

// ✅ **Check Authentication Status**
app.get("/check-auth", (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, username: req.session.user.username });
  } else {
    res.json({ authenticated: false });
  }
});

// ✅ **Logout Route**
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logout successful" });
  });
});

// ✅ **Middleware to Check Authentication**
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized. Please log in first." });
  }
  next();
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

app.post("/upload", isAuthenticated, upload.single("document"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.status(201).json({ message: "Document uploaded successfully", filename: req.file.filename });
});

// ✅ **Get Uploaded Documents**
app.get("/documents", isAuthenticated, (req, res) => {
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
app.get("/download/:filename", isAuthenticated, (req, res) => {
  const username = req.session.user.username;
  const filePath = path.join(uploadsDir, username, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath);
});

// ✅ **Delete Document**
app.delete("/delete/:filename", isAuthenticated, (req, res) => {
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
