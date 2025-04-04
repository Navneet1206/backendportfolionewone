require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");
const Contact = require("./models/Contact");
const {
  adminEmailTemplate,
  userEmailTemplate,
} = require("./utils/emailTemplates");

const app = express();

// Explicit CORS configuration to allow all origins and methods
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());

// MongoDB Connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};
connectDB();

// Input validation middleware
const validateInput = (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "Please provide a valid name (minimum 2 characters)" });
  }

  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
  }

  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return res
      .status(400)
      .json({ message: "Message must be at least 10 characters long" });
  }

  req.sanitizedData = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  };

  next();
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form endpoint
app.post("/api/contact", validateInput, async (req, res) => {
  try {
    const { name, email, message } = req.sanitizedData;

    // Save to MongoDB
    const contact = new Contact({ name, email, message });
    await contact.save();

    try {
      // Send email to admin
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New Contact Form Submission",
        html: adminEmailTemplate({ name, email, message }),
      });

      // Send confirmation email to user
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Thank You for Contacting Us",
        html: userEmailTemplate({ name, email, message }),
      });

      res.status(200).json({
        success: true,
        message: "Message sent successfully!",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      res.status(207).json({
        success: true,
        message: "Message received but email confirmation failed",
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing your request. Please try again later.",
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error. Please try again later.",
  });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// For Vercel deployment
module.exports = app;
