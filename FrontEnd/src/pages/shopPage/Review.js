import React, { useState, useEffect } from 'react';
import "./Review.css";

const Review = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ name: '', review: '', rating: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch reviews from the backend
        fetch('/api/reviews')
            .then((response) => response.json())
            .then((data) => setReviews(data))
            .catch((error) => console.error('Error fetching reviews:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview({ ...newReview, [name]: value });
    };

    const handleRatingChange = (rating) => {
        setNewReview({ ...newReview, rating });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (newReview.name.trim() && newReview.review.trim() && newReview.rating > 0) {
            fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReview),
            })
                .then((response) => response.json())
                .then((data) => {
                    setReviews([...reviews, data]);
                    setNewReview({ name: '', review: '', rating: 0 });
                    setIsModalOpen(false);
                })
                .catch((error) => console.error('Error submitting review:', error));
        }
    };

    return (
        <div className="review-container">
            <h2 className="review-header">Customer Reviews</h2>
            <button className="add-review-btn" onClick={() => setIsModalOpen(true)}>
                + Add Review
            </button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h3 className="modal-title">Add Your Review</h3>
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={newReview.rating >= star ? "star selected" : "star"}
                                    onClick={() => handleRatingChange(star)}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                        <form onSubmit={handleReviewSubmit} className="review-form">
                            <input
                                type="text"
                                name="name"
                                value={newReview.name}
                                onChange={handleInputChange}
                                placeholder="Your Name"
                                className="form-input"
                            />
                            <textarea
                                name="review"
                                value={newReview.review}
                                onChange={handleInputChange}
                                placeholder="Write your review here..."
                                className="form-textarea"
                            />
                            <button type="submit" className="submit-btn">Submit</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="reviews-list">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="review-item">
                            <h4 className="review-name">{review.name}</h4>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={review.rating >= star ? "star selected" : "star"}
                                    >
                                        &#9733;
                                    </span>
                                ))}
                            </div>
                            <p className="review-text">{review.review}</p>
                        </div>
                    ))
                ) : (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                )}
            </div>
        </div>
    );
};

export default Review;
