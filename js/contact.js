document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navLinks = document.querySelectorAll(".nav-link");

    // Toggle the navigation menu when the hamburger menu is clicked
    navbarToggler.addEventListener("click", function () {
      navbarCollapse.classList.toggle("show");
    });

    // Toggle the navigation menu when the button is clicked again
    navbarToggler.addEventListener("click", function () {
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.classList.remove("show");
      } else {
        navbarCollapse.classList.add("show");
      }
    });

    // Hide the navigation menu when a menu item is clicked
    navLinks.forEach(function (navLink) {
      navLink.addEventListener("click", function () {
        navbarCollapse.classList.remove("show");
      });
    });

    // Hide the navigation menu when clicking outside the menu
    document.addEventListener("click", function (event) {
      if (!navbarToggler.contains(event.target) && !navbarCollapse.contains(event.target)) {
        navbarCollapse.classList.remove("show");
      }
    });
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Fetch form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Simple validation (can be expanded)
        if (!name || !email || !message) {
            alert("Please fill all the fields");
            return;
        }

        // TODO: Implement AJAX request to send form data to server
        console.log('Form submitted', { name, email, message });
        // Reset form after submission
        form.reset();
    });
});
