document.addEventListener('DOMContentLoaded', function() {
    fetch('json/comunidad.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('.table tbody');
            
            data.communityTopics.forEach(topic => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${topic.title}</td>
                        <td>${topic.author}</td>
                        <td>${topic.likes}</td>
                        <td>${topic.comments}</td>
                        <td>${topic.visits}</td>
                        <td>${topic.favorites}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
});