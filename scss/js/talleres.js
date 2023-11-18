document.addEventListener('DOMContentLoaded', function() {
    fetch('../json/talleres.json')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.grid-container.items');
            data.forEach(item => {
                container.innerHTML += `
                    <div class="col-md-4 mb-3">
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
});