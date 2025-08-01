//Naing Lin Htet DISM/2B/21 P2329606

document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const currentUrl = "http://localhost:3000"; // Adjust this to your server's URL

    if (!userId || !token) {
        window.location.href = "login.html";
        return;
    }

    const reviewList = document.getElementById("reviewList");
    const reviewForm = document.getElementById("reviewForm");
    const reviewTextInput = document.getElementById("reviewTextInput");
    const ratingInput = document.getElementById("ratingInput");
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const editReviewTextInput = document.getElementById("editReviewTextInput");
    const editRatingInput = document.getElementById("editRatingInput");
    const saveEditBtn = document.getElementById("saveEditBtn");

    let currentEditingReviewId = null;

    const fetchReviews = () => {
        fetch(`${currentUrl}/api/reviews`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(reviews => {
            if (!Array.isArray(reviews)) {
                console.error('Expected an array but got:', reviews);
                return;
            }
            displayReviews(reviews);
        })
        .catch(error => console.error("Error fetching reviews:", error));
    };

    const displayReviews = (reviews) => {
        reviewList.innerHTML = "";
        reviews.forEach(review => {
            const reviewCard = document.createElement("div");
            reviewCard.classList.add("card", "mb-3");
            reviewCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${review.username}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Rating: ${review.rating}</h6>
                    <p class="card-text">${review.review_text}</p>
                    <footer class="blockquote-footer">
                        ${new Date(review.created_at).toLocaleTimeString()}
                    </footer>
                    ${review.user_id === userId ? `
                        <button class="btn btn-secondary edit-button mt-2" data-review-id="${review.id}">Edit</button>
                        <button class="btn btn-danger delete-button mt-2" data-review-id="${review.id}">Delete</button>
                    ` : ""}
                </div>
            `;
            reviewList.appendChild(reviewCard);
        });

        // Attach event listeners to edit and delete buttons
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function () {
                currentEditingReviewId = this.dataset.reviewId;
                const reviewText = this.parentElement.querySelector(".card-text").textContent;
                const rating = this.parentElement.querySelector(".card-subtitle").textContent.replace('Rating: ', '');
                editReviewTextInput.value = reviewText;
                editRatingInput.value = rating;
                editReviewTextInput.dataset.reviewId = currentEditingReviewId; // Store review ID in textarea
                editModal.show();
            });
        });

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", function () {
                const reviewId = this.dataset.reviewId;
                if (confirm("Are you sure you want to delete this review?")) {
                    deleteReview(reviewId);
                }
            });
        });
    };

    reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const reviewText = reviewTextInput.value.trim();
        const rating = parseInt(ratingInput.value, 10);

        if (!reviewText || isNaN(rating) || rating < 1 || rating > 5) {
            console.error("Review text and rating must be provided and rating must be between 1 and 5");
            return;
        }

        const reviewData = {
            user_id: userId,
            username: username,
            review_text: reviewText,
            rating: rating
        };

        fetch(`${currentUrl}/api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(reviewData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            fetchReviews(); // Refresh reviews list
            reviewForm.reset(); // Clear form fields
        })
        .catch(error => console.error("Error sending review:", error));
    });

    saveEditBtn.addEventListener("click", () => {
        const updatedReviewText = editReviewTextInput.value.trim();
        const updatedRating = parseInt(editRatingInput.value, 10);
        const reviewId = editReviewTextInput.dataset.reviewId;

        if (!updatedReviewText || isNaN(updatedRating) || updatedRating < 1 || updatedRating > 5) {
            console.error("Updated review text and rating must be provided and rating must be between 1 and 5");
            return;
        }

        fetch(`${currentUrl}/api/reviews/${reviewId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ review_text: updatedReviewText, rating: updatedRating })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            editModal.hide();
            fetchReviews(); // Refresh reviews list
        })
        .catch(error => console.error("Error updating review:", error));
    });

    const deleteReview = (reviewId) => {
        fetch(`${currentUrl}/api/reviews/${reviewId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            fetchReviews(); // Refresh reviews list
        })
        .catch(error => console.error("Error deleting review:", error));
    };

    fetchReviews(); // Initial fetch of reviews
});
