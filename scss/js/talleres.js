document.addEventListener('DOMContentLoaded', function() {
    fetch('../json/talleres.json')
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector('.grid-container.items');
            data.forEach(item => {
                container.innerHTML += `
                    <div class="item">
                        <img src="${item.image}" alt="${item.alt}">
                        <p>${item.description}</p>
                    </div>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
});