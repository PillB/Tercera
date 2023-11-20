document.addEventListener('DOMContentLoaded', function() {
    fetch('../json/talleres.json')
        .then(response => response.json())
        .then(data => {
            // Correct the selector to match the HTML structure.
            // The container is the direct parent of the workshop items.
            const container = document.querySelector('.carousel > .row');

            // Check if container is found
            if (!container) {
                console.error('Container not found for workshops');
                return;
            }

            // Adding each item to the container
            data.forEach(item => {
                container.innerHTML += `
                    <div class="col-md-4 mb-3" data-topic="${item.topic.toLowerCase()}"> 
                        <div class="card">
                            <img src="${item.image}" class="card-img-top" alt="${item.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text">${item.text}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
            // Function to populate topic filter options
            populateTopicFilter(data);    
            filterWorkshops();
            initMap();  
        })
        .catch(error => console.error('Error:', error));

    // Toggle filter section
    document.querySelector('.filter-toggle').addEventListener('click', () => {
        const filters = document.getElementById('workshopFilters');
        filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
    });

    // Filter functionality
    document.getElementById('topic').addEventListener('change', function() {
        filterWorkshops();
    });

    function filterWorkshops() {
        const selectedTopic = document.getElementById('topic').value;
        const workshops = document.querySelectorAll('.col-md-4');

        workshops.forEach(workshop => {
            const topic = workshop.getAttribute('data-topic');
            if ((selectedTopic === 'all') || (topic === selectedTopic)) {
                workshop.style.display = '';
            } else {
                workshop.style.display = 'none';
            };
        })
    }

    // Function to populate topic filter options
    function populateTopicFilter(data) {
        const topicSelect = document.getElementById('topic');
        const existingOptions = new Set();
    
        // Collect existing topics from HTML
        document.querySelectorAll('#topic option').forEach(option => {
            if (option.value && option.value !== 'all') {
                existingOptions.add(option.value.toLowerCase());
            }
        });
    
        // Add new topics from JSON data
        data.forEach(workshop => {
            existingOptions.add(workshop.topic.toLowerCase());
        });
    
        // Clear existing options except the 'all' option
        topicSelect.innerHTML = '<option value="all">Todos</option>';
    
        // Populate the dropdown with combined unique topics
        existingOptions.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic.charAt(0).toUpperCase() + topic.slice(1); // Capitalize first letter for display
            topicSelect.appendChild(option);
        });
    }
    
    function initMap() {
        try {
            var mapOptions = {
                zoom: 8,
                center: { lat: -34.397, lng: 150.644 }, // Example coordinates
            };
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
            // Add markers for each workshop location
            // Example: new google.maps.Marker({ position: { lat: -34.397, lng: 150.644 }, map: map });
            // Add more markers as needed
        } catch (error) {
            console.error('Google Maps API error:', error);
            displayStaticMapFallback();
        }
    }
    
    function displayStaticMapFallback() {
        const mapContainer = document.getElementById('map');
        mapContainer.innerHTML = `<iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.3821975497084!2d-77.04279388518705!3d-12.046374045576708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105b8405c6f8c9f%3A0x5d4c3e4c9f1b8e0!2sLima!5e0!3m2!1sen!2spe!4v1645631258431!5m2!1sen!2spe"
            width="600"
            height="450"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>`;
    }
        
});


