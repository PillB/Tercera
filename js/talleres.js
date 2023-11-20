document.addEventListener('DOMContentLoaded', function() {
    fetch('../json/talleres.json')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.grid-container.items');
            data.forEach(item => {
                container.innerHTML += `
                    <div class="col-md-4 mb-3" data-topic="${item.topic}">
                        <div class="item card">
                            <img src="${item.image}" class="card-img-top" alt="${item.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${item.title}</h5>
                                <p class="card-text">${item.text}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
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
        const topicSet = new Set();
        data.forEach(workshop => {
            // Convert topic to lower case before adding to set
            topicSet.add(workshop.topic.toLowerCase());
        });
    
        const topicSelect = document.getElementById('topic');
        topicSet.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            // Capitalize first letter for display
            option.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
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


