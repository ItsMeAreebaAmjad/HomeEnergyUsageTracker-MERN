const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // Add JWT for session management
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Ensure crypto is imported
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Ensure the uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "backend1"
});

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Signup Route
app.post('/signup', upload.single('image'), (req, res) => {
  const checkEmailSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailSql, [req.body.email], (err, result) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ Error: "Error checking email" });
    }
    if (result.length > 0) {
      return res.status(400).json({ Error: "Email already exists" });
    }

    const sql = "INSERT INTO users(`firstName`, `lastName`, `email`, `password`, `profileImage`) VALUES (?, ?, ?, ?, ?)";
    const values = [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password, // Store plain text password directly
      req.file ? req.file.filename : null,
    ];
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting data into database:", err);
        return res.status(500).json({ Error: "Inserting data error in server" });
      }
      return res.json({ Status: "Success" });
    });
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error retrieving user:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid User" });
    }

    const user = results[0];
    // Check password match (assuming plaintext comparison)
    if (user.password !== password) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    // Successful login
    res.json({ message: "Login successful", user });
  });
});


// Example backend route to handle profile updates
// Example backend route to handle profile updates
// Example backend route to handle profile updates
app.put('/profile/:email', upload.single('profileImage'), async (req, res) => {
  const email = req.params.email;
  const { firstName, lastName } = req.body; // Assuming using body parser middleware
  let profileImage = req.file ? req.file.filename : null;

  try {
    // Update user profile in the database
    let updateSql = "UPDATE users SET firstName = ?, lastName = ?";
    let values = [firstName, lastName];

    // Check if profileImage is provided to update
    if (profileImage) {
      updateSql += ", profileImage = ?";
      values.push(profileImage);
    }

    updateSql += " WHERE email = ?";
    values.push(email);

    // Execute the update query
    db.query(updateSql, values, (err, result) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ error: 'Server error' });
      }

      // Fetch updated user data after update
      const fetchSql = "SELECT * FROM users WHERE email = ?";
      db.query(fetchSql, [email], (err, results) => {
        if (err) {
          console.error('Error fetching updated profile:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = results[0];
        return res.status(200).json(updatedUser);
      });
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Backend endpoint to remove profile picture
app.put('/profile/remove/:email', async (req, res) => {
  const email = req.params.email;

  try {
    // Find user by email and update profileImage to null
    const updateUserSql = "UPDATE users SET profileImage = NULL WHERE email = ?";
    const updateResult = await db.query(updateUserSql, [email]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return success response
    return res.status(200).json({ message: 'Profile picture removed successfully' });
  } catch (error) {
    console.error('Error removing profile picture:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


//email wala kaam


// Sending Email to User 
const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:'areebaamjadareebaamjad@gmail.com',
      pass:'yttunlkizmnjkrfv'
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>You are receiving this email because you has requested the reset of the password for your account.</p>
           <p>Please click on the following link, or paste this into your browser to complete the process:</p>
           <p><a href="http://localhost:5173/reset-password/${token}">Reset Password Link</a></p>
           <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: "Email not found" });
    }

    const token = crypto.randomBytes(20).toString('hex'); // Generate a token
    const expiration = Date.now() + 3600000; // Token expires in 1 hour

    const updateSql = "UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?";
    db.query(updateSql, [token, expiration, email], (err, result) => {
      if (err) {
        console.error("Error updating token:", err);
        return res.status(500).json({ error: "Database error" });
      }
      sendResetPasswordEmail(email, token);
      res.json({ message: "Password reset email sent" });
    });
  });
});



// Route to handle password reset
// Route to handle password reset
app.post('/reset-password', async (req, res) => {
  const { password, confirmPassword, token } = req.body;
  
  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  
  const currentTimestamp = Date.now();
  
  // Query to find user by reset token and check expiration
  const sql = "SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires >= ?";
  
  db.query(sql, [token, currentTimestamp], (err, results) => {
    if (err) {
      console.error("Error finding user by token:", err);
      return res.status(500).json({ error: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    
    // Update user's password in the database
    const updateSql = "UPDATE users SET password = ? WHERE email = ?";
    
    db.query(updateSql, [password, results[0].email], (err, result) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ error: "Database error" });
      }
      
      res.json({ message: "Password updated successfully" });
    });
  });
});







app.listen(8081, () => {
  console.log("Server running on port 8081");
});
