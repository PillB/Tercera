function initMap() {
    try {
        var mapOptions = {
            zoom: 8,
            center: { lat: -77.152, lng: -12.026 }, // Example coordinates
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
function checkMapLoaded() {
    // Check if the map is loaded (you might need to adjust this check based on your implementation)
    if (!document.querySelector('.gm-style')) {
        console.error('Google Maps API failed to load');
        displayStaticMapFallback();
    }
}

// Call initMap after a timeout period to check if map loaded
setTimeout(checkMapLoaded, 5000);  // Adjust the timeout as needed

function displayStaticMapFallback() {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = `<iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249744.04474635242!2d-77.1525926631275!3d-12.02625416661249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5f619ee3ec7%3A0x14206cb9cc452e4a!2sLima!5e0!3m2!1sen!2spe!4v1700523675863!5m2!1sen!2spe"
        width="100%"
        height="100%"
        style="border:0;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>`;
}