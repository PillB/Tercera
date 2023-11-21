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
            initializeShowMore();
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
        initializeShowMore(); // Re-initialize show more after filtering
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
    function initializeShowMore() {
        const cardsToShow = 6;
        const cards = document.querySelectorAll('.col-md-4');
        const showMoreBtn = document.getElementById('showMoreBtn');

        cards.forEach((card, index) => {
            if (index >= cardsToShow) {
                card.classList.add('d-none');
            }
        });

        showMoreBtn.addEventListener('click', () => {
            let currentlyShown = Array.from(cards).filter(card => !card.classList.contains('d-none')).length;
            cards.forEach((card, index) => {
                if (index >= currentlyShown && index < currentlyShown + cardsToShow) {
                    card.classList.remove('d-none');
                }
            });

            if (currentlyShown + cardsToShow >= cards.length) {
                showMoreBtn.classList.add('d-none');
            }
        });
    }
});


