const mongoose = require('mongoose');
const bookReviewSchema = new mongoose.Schema({
    bookTitle: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    reviewText: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
});
const BookReview = mongoose.model('BookReview', bookReviewSchema);
module.exports = BookReview;
