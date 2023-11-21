document.addEventListener('DOMContentLoaded', function() {
    // Adjust canvas size after content is loaded
    adjustCanvasSize();
});
// Initialize TinyMCE Editor
tinymce.init({ selector: '#description' });

// Initialize Dropzone for image upload
Dropzone.options.imageUpload = {
    url: '/upload-image', // Server script for handling uploads
    maxFiles: 1,
    acceptedFiles: 'image/*',
    dictDefaultMessage: 'Drop your image here or click to upload (Only images)',
};

// Initialize Tagify for tagging
new Tagify(document.querySelector('#tags'));

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
// Form submission with AJAX and DOMPurify
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const title = DOMPurify.sanitize(document.getElementById('title').value);
    const description = tinymce.get('description').getContent();
    if (!description.trim()) {
        alert('Please fill out the description.');
        return;
    }
    const category = DOMPurify.sanitize(document.getElementById('category').value);
    const tags = DOMPurify.sanitize(document.getElementById('tags').value);
    const image = document.querySelector('#image-upload').dropzone.files[0]; // Get the uploaded file

    // Create FormData object for AJAX request
    let formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    if (image) formData.append('image', image);

    // AJAX request to server
    fetch('/submit-project', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Handle response
        console.log('Success:', data);
        // Redirect or show success message
    })
    .catch((error) => {
        console.error('Fetch Error:', error);
        // Handle errors here
    });
    // Adjust canvas size after content is loaded
    adjustCanvasSize();
});


window.addEventListener('resize', adjustCanvasSize); // Adjust canvas size on window resize