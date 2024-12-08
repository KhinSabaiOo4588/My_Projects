document.addEventListener("DOMContentLoaded", function() {
    let mainNav = document.getElementById('main-nav');
    let navbarToggle = document.getElementById('navbar-toggle');

    // Add event listener to the hamburger menu icon for toggling the visibility of the main navigation menu
    navbarToggle.addEventListener('click', function() {
        if (this.classList.contains('active')) {
            mainNav.style.display = "none";
            this.classList.remove('active');
        } else {
            mainNav.style.display = "flex";
            this.classList.add('active');
        }
    });
});
