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
            topicSet.add(workshop.topic);
        });

        const topicSelect = document.getElementById('topic');
        topicSet.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic.charAt(0).toUpperCase() + topic.slice(1); // Capitalize first letter
            topicSelect.appendChild(option);
        });
    }
});


