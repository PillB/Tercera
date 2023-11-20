document.addEventListener('DOMContentLoaded', function() {
    fetch('json/index.json')
        .then(response => response.json())
        .then(data => {
            const projectCarousel = document.querySelector('#featuredProjectsCarousel .carousel-inner');
            const newsCarousel = document.querySelector('#aiNewsCarousel .carousel-inner');

            // Function to create carousel items
            function createCarouselItems(items, container, isProject = true) {
                let carouselHTML = '';
                let rowContent = '';
                let itemCount = 0;

                items.forEach((item, index) => {
                    // Start a new row for every 3 items
                    if (itemCount === 0) {
                        rowContent = `<div class="row">`;
                    }

                    // Add the item to the row
                    rowContent += isProject ? `
                        <div class="col-md-4">
                            <div class="card">
                                <img src="${item.image}" class="card-img-top" alt="${item.alt}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.text}</p>
                                    <a href="#" class="btn btn-secondary">Read More</a>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="col-md-4">
                            <div class="news-item card">
                                <img src="${item.image}" alt="${item.alt}">
                                <h5>${item.title}</h5>
                                <p>${item.text}</p>
                                <a href="#" class="btn btn-secondary">Read More</a>
                            </div>
                        </div>
                    `;

                    itemCount++;

                    // Close the row and add to carouselHTML after every 3 items or at the end
                    if (itemCount === 3 || index === items.length - 1) {
                        rowContent += `</div>`; // Close the row
                        carouselHTML += `<div class="carousel-item ${index < 3 ? 'active' : ''}">${rowContent}</div>`;
                        itemCount = 0; // Reset item count for the next row
                    }
                });

                container.innerHTML = carouselHTML;
            }

            createCarouselItems(data.featuredProjects, projectCarousel, true);
            createCarouselItems(data.aiNews, newsCarousel, false);
        })
        .catch(error => console.error('Error:', error));
});
