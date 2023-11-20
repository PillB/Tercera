document.addEventListener('DOMContentLoaded', function() {
    fetch('../json/explorar.json')
        .then(response => response.json())
        .then(data => {
            const projectsContainer = document.querySelector('.carousel:first-of-type > .row');
            const articlesContainer = document.querySelector('.carousel:last-of-type > .row');

            data.aiProjects.forEach(project => {
                projectsContainer.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="item card">
                            <img src="${project.image}" class="card-img-top" alt="${project.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${project.title}</h5>
                                <p class="card-text">${project.text}</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            data.aiArticles.forEach(article => {
                articlesContainer.innerHTML += `
                    <div class="col-md-4 mb-3">
                        <div class="item card">
                            <img src="${article.image}" class="card-img-top" alt="${article.alt}">
                            <div class="card-body">
                                <h5 class="card-title">${article.title}</h5>
                                <p class="card-text">${article.text}</p>
                            </div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
});