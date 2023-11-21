function initMap() {
    try {
        var mapOptions = {
            zoom: 12,
            center: { lat: -12.0464, lng: -77.0428 } // Center map around Lima, Peru
        };
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        // Fetch JSON data and add markers
        fetch('../json/talleres.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    // Assuming each item has a 'position' with lat and lng
                    var position = { lat: item.position.lat, lng: item.position.lng };
                    var marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: item.title
                    });
                });
            })
            .catch(error => {
                console.error('Error loading workshop data:', error);
                displayStaticMapFallback();
            });
    } catch (error) {
        console.error('Google Maps API error:', error);
        displayStaticMapFallback();
        adjustCanvasSize();
    }
    // Adjust canvas size after content is loaded
    adjustCanvasSize();
}
function checkMapLoaded() {
    // Check if the map is loaded (you might need to adjust this check based on your implementation)
    if (!document.querySelector('.gm-style')) {
        console.error('Google Maps API failed to load');
        displayStaticMapFallback();
        adjustCanvasSize();
    }
    // Adjust canvas size after content is loaded
    adjustCanvasSize();
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
    // Adjust canvas size after content is loaded
    adjustCanvasSize();
}

let myp5;
let footer = document.querySelector('.footer-content'); // Assuming 'footer' is the class name
let footerHeight = footer.offsetHeight;
function adjustCanvasSize() {
    if (myp5) {
        myp5.resizeCanvas(myp5.windowWidth, document.body.scrollHeight-(footerHeight));
        myp5.redraw();
    }
}

myp5 = new p5((p) => {
    let nodes = [];
    const nodeCount = 30; // Adjust the density of the nodes

    p.setup = () => {
        let canvas = p.createCanvas(p.windowWidth, document.body.scrollHeight-(footerHeight));
        canvas.position(0, 0);
        canvas.style('z-index', '-9'); // Place canvas behind content
        p.noLoop();
        // Apply blur effect
        p.drawingContext.filter = 'blur(10px)'; // Adjust the blur radius as needed

        for (let i = 0; i < nodeCount; i++) {
            nodes.push(createNode(p));
        }
    };

    p.draw = () => {
        p.clear();
        p.background(255, 127); // 50% transparency
        nodes.forEach((node) => {
            drawEdges(p, node, nodes);
            drawNode(p, node);
        });
    };

    p.windowResized = () => {
        adjustCanvasSize();
    };

    // ... createNode, drawNode, drawEdges functions ...
    function createNode(p) {
        return {
            x: p.random(p.width),
            y: p.random(p.height),
            radius: p.random(5, 10) // Randomize for variety
        };
    }

    function drawNode(p, node) {
        p.fill(p.color(127, 127, 213, 26)); // Soft Purple color
        p.noStroke();
        p.ellipse(node.x, node.y, node.radius * 2, node.radius * 2);
    }

    function drawEdges(p, node, nodes) {
        p.stroke(p.color(92, 172, 238, 26)); // Light Blue color
        p.strokeWeight(1);
    
        // Sort nodes by distance from the current node
        let sortedNodes = nodes
            .map(otherNode => {
                return {
                    node: otherNode,
                    distance: p.dist(node.x, node.y, otherNode.x, otherNode.y)
                };
            })
            .sort((a, b) => a.distance - b.distance);
    
        // Connect to the closest nodes, ensuring almost all nodes are connected
        for (let i = 1; i < sortedNodes.length; i++) {
            if (i <= sortedNodes.length * 0.50) { // Connect to 99% of closest nodes
                let otherNode = sortedNodes[i].node;
                p.line(node.x, node.y, otherNode.x, otherNode.y);
            }
        }
    }
}, document.body); 

window.addEventListener('resize', adjustCanvasSize); // Adjust canvas size on window resize
