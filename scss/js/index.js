document.addEventListener('DOMContentLoaded', function() {
    fetch('json/index.json')
        .then(response => response.json())
        .then(data => {
            const projectContainer = document.querySelector('.featured-projects .row');
            const newsContainer = document.querySelector('.latest-news .row');

            data.featuredProjects.forEach(project => {
                projectContainer.innerHTML += `
                    <div class="col-md-4">
                        <div class="card">
                            <img src="${project.image}" class="card-img-top" alt="${project.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${project.title}</h5>
                                <p class="card-text">${project.text}</p>
                                <a href="#" class="btn btn-secondary">Read More</a>
                            </div>
                        </div>
                    </div>
                `;
            });

            data.aiNews.forEach(news => {
                newsContainer.innerHTML += `
                    <div class="col-md-4">
                        <div class="news-item">
                            <img src="${news.image}" alt="${news.alt}">
                            <h5>${news.title}</h5>
                            <p>${news.text}</p>
                            <a href="#" class="btn btn-link">Read More</a>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
});