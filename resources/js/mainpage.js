function mainpageNav(event){
    event.preventDefault();

    // Navigate to the specified href
    window.location.href = event.target.getAttribute('href');
}

document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.getElementById("add-comment-button");
    const commentForm = document.getElementById("new-comment-form");

    addButton.addEventListener("click", function () {
        commentForm.style.display = commentForm.style.display === "none" ? "block" : "none";
    });

    const submitButton = document.getElementById("submit-comment");
    submitButton.addEventListener("click", function () {
        commentForm.style.display = "none";
    });
});

