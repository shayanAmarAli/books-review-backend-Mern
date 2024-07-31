require("dotenv").config() // load .env variables
const express = require("express") // import express
const morgan = require("morgan") //import morgan
const {log} = require("mercedlogger") // import mercedlogger's log function
const cors = require("cors") // import cors
const UserRouter = require("../controllers/users") //import User Routes
require("dotenv").config(); // load .env variables
const { Router } = require("express"); // import router from express
const User = require("../modals/user"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const BookReview = require("../modals/review")
const { mongoose } = require("mongoose")
const bodyParser = require('body-parser');

const router = Router(); // create router to create route bundle

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES
const {PORT = 3000} = process.env

// Create Application Object
const app = express()


// GLOBAL MIDDLEWARE
app.use(cors()) // add cors headers
app.use(morgan("tiny")) // log the request for debugging
app.use(express.json()) // parse json bodies
app.use(bodyParser.json());


// Signup route to create a new user
app.post("/signup", async (req, res) => {
  try {
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const user = await User.create(req.body);
    // send new user as response
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Login route to verify a user and get a token
app.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        const token = await jwt.sign({ username: user.username }, SECRET);
        res.json({ token });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Review route to store info about user's review 
app.post('/reviews/create', async (req, res) => {
  try {
    const { bookTitle, author, reviewText, rating } = req.body;

    // Create a new book review
    const newReview = new BookReview({
      bookTitle,
      author,
      reviewText,
      rating
    });

    // Save the review to the database
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving review' });
  }
});

// Review route to fetching info about user's review 
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await BookReview.find();
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});


// Review route to modify the user's review
app.put('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the review ID from the URL
    const updateData = req.body; // Get the new review data from the request body

    // Validate input (optional but recommended)
    // const { bookTitle, author, reviewText, rating } = updateData;
    // if (!bookTitle || !author || !reviewText || typeof rating !== 'number' || rating < 1 || rating > 5) {
    //   return res.status(400).json({ message: 'Invalid input data' });
    // }

    // Find the review by ID and update it
    const updatedReview = await BookReview.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // Check if the review exists
    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Send the updated review back to the client
    res.json(updatedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Review route to delete the user's review
app.delete('/reviews/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await BookReview.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch   
 (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

// ROUTES AND ROUTES
app.get("/", (req, res) => res.send("Books Review Auth on Vercel"));

// APP LISTENER
app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`))
module.exports = app;
