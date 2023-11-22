document.addEventListener('DOMContentLoaded', function() {
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
